import {
  vkAllocateCommandBuffers,
  vkBeginCommandBuffer,
  VkClearValue,
  vkCmdBeginRenderPass,
  vkCmdBindPipeline,
  vkCmdBindVertexBuffers,
  vkCmdDraw,
  vkCmdEndRenderPass,
  VkCommandBuffer,
  VkCommandBufferAllocateInfo,
  VkCommandBufferBeginInfo,
  VkCommandPool,
  VkCommandPoolCreateInfo,
  vkCreateCommandPool,
  vkCreateFramebuffer,
  VkDevice,
  vkEndCommandBuffer,
  VkFramebuffer,
  VkFramebufferCreateInfo,
  VkImageView,
  VkInout,
  VkOffset2D,
  VkPhysicalDevice,
  VkRect2D,
  VkRenderPass,
  VkRenderPassBeginInfo,
  VkStructureType,
  VK_COMMAND_BUFFER_LEVEL_PRIMARY,
  VK_COMMAND_BUFFER_USAGE_SIMULTANEOUS_USE_BIT,
  VK_PIPELINE_BIND_POINT_GRAPHICS,
  VK_SUBPASS_CONTENTS_INLINE,
  VulkanWindow
} from "nvk";
import { getExtent2D } from "../window";
import { submit } from "../vulkan";
import { createPipeline } from "./pipeline";
import { createVertexBuffer } from "./vertex-buffer";

export function createCommandPool(device: VkDevice) {
  const commandPool = new VkCommandPool();
  const commandPoolInfo = new VkCommandPoolCreateInfo({
    flags: 0,
    sType: VkStructureType.VK_STRUCTURE_TYPE_COMMAND_POOL_CREATE_INFO,
    queueFamilyIndex: 0
  });
  submit(vkCreateCommandPool, device, commandPoolInfo, null, commandPool)
  return commandPool;
}

// eslint-disable-next-line max-params
function getFramebuffers(
  window: VulkanWindow,
  device: VkDevice,
  amountOfImagesInSwapchain: VkInout,
  imageViews: VkImageView[],
  renderPass: VkRenderPass | null | undefined
) {
  const framebuffers = [...Array(amountOfImagesInSwapchain.$)].map(() => new VkFramebuffer());
  for(let i=0; i<amountOfImagesInSwapchain.$; i+=1) {
    const framebufferInfo = new VkFramebufferCreateInfo({
      sType: VkStructureType.VK_STRUCTURE_TYPE_FRAMEBUFFER_CREATE_INFO,
      renderPass,
      attachmentCount: 1,
      pAttachments: [imageViews[i]],
      width: window.width,
      height: window.height,
      layers: 1
    })
    submit(vkCreateFramebuffer, device, framebufferInfo, null, framebuffers[i]);
  }
  return framebuffers;
}

// - window
// renderPass
// - imageViews
// pipeline
// vertexBuffer
export function createCommandBuffers(
  window: VulkanWindow,
  device: VkDevice,
  physicalDevice: VkPhysicalDevice,
  amountOfImagesInSwapchain: { $: number },
  imageViews: VkImageView[],
  renderPass: VkRenderPass
) {
  const commandPool = createCommandPool(device);
  const framebuffers = getFramebuffers(window, device, amountOfImagesInSwapchain, imageViews, renderPass);
  const bufferAllocInfo = new VkCommandBufferAllocateInfo({
    sType: VkStructureType.VK_STRUCTURE_TYPE_COMMAND_BUFFER_ALLOCATE_INFO,
    commandPool,
    level: VK_COMMAND_BUFFER_LEVEL_PRIMARY,
    commandBufferCount: amountOfImagesInSwapchain.$
  });
  const commandBuffers = [...Array(amountOfImagesInSwapchain.$)].map(() => new VkCommandBuffer());
  submit(vkAllocateCommandBuffers, device, bufferAllocInfo, commandBuffers);

  const bufferBeginInfo = new VkCommandBufferBeginInfo({
    sType: VkStructureType.VK_STRUCTURE_TYPE_COMMAND_BUFFER_BEGIN_INFO,
    flags: VK_COMMAND_BUFFER_USAGE_SIMULTANEOUS_USE_BIT,
    pInheritanceInfo: null
  });
  const vertices = new Float32Array([
    0.0, -0.5,
    0.5, 0.5,
    -0.5, 0.5
  ]);
  const vertexBuffer = createVertexBuffer(device, physicalDevice, vertices);
  const pipeline = createPipeline(window, device, renderPass, vertices);
  for(let i=0; i<commandBuffers.length; i+=1) {
    const buffer = commandBuffers[i];
    submit(vkBeginCommandBuffer, buffer, bufferBeginInfo);

    const clearValue = new VkClearValue();
    const renderPassBeginInfo = new VkRenderPassBeginInfo({
      sType: VkStructureType.VK_STRUCTURE_TYPE_RENDER_PASS_BEGIN_INFO,
      renderPass,
      framebuffer: framebuffers[i],
      renderArea: new VkRect2D({
        offset: new VkOffset2D({
          x: 0,
          y: 0
        }),
        extent: getExtent2D(window)
      }),
      clearValueCount: 1,
      pClearValues: [clearValue]
    });

    vkCmdBeginRenderPass(buffer, renderPassBeginInfo, VK_SUBPASS_CONTENTS_INLINE);
    vkCmdBindPipeline(buffer, VK_PIPELINE_BIND_POINT_GRAPHICS, pipeline);
    vkCmdBindVertexBuffers(buffer, 0, 1, [vertexBuffer], new BigUint64Array([0n]));
    vkCmdDraw(buffer, 3, 1, 0, 0);
    vkCmdEndRenderPass(buffer);
    submit(vkEndCommandBuffer, buffer);
  }
  return commandBuffers;
}
