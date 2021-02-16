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
  VkDevice,
  vkEndCommandBuffer,
  VkImageView,
  VkOffset2D,
  VkPhysicalDevice,
  VkRect2D,
  VkRenderPassBeginInfo,
  VkStructureType,
  VK_COMMAND_BUFFER_LEVEL_PRIMARY,
  VK_COMMAND_BUFFER_USAGE_SIMULTANEOUS_USE_BIT,
  VK_PIPELINE_BIND_POINT_GRAPHICS,
  VK_SUBPASS_CONTENTS_INLINE
} from "nvk";
import { View, getExtent2D } from "../view";
import { submit } from "../vulkan";
import { createPipeline } from "../pipeline";
import { createRenderPass } from "../pipeline/render-pass";
import { createFrameBuffers } from "./frame-buffers";
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

export function createCommandBuffers(
  view: View,
  device: VkDevice,
  physicalDevice: VkPhysicalDevice,
  imageViews: VkImageView[],
  vertices: Float32Array
) {
  // Create Pipeline
  const renderPass = createRenderPass(device);
  const pipeline = createPipeline(view, device, renderPass);

  // Create FrameBuffers
  const frameBuffers = createFrameBuffers(view, device, imageViews, renderPass);

  // Allocate Command Buffers
  const bufferAllocInfo = new VkCommandBufferAllocateInfo({
    sType: VkStructureType.VK_STRUCTURE_TYPE_COMMAND_BUFFER_ALLOCATE_INFO,
    commandPool: createCommandPool(device),
    level: VK_COMMAND_BUFFER_LEVEL_PRIMARY,
    commandBufferCount: imageViews.length
  });
  const commandBuffers = [...Array(imageViews.length)].map(() => new VkCommandBuffer());
  submit(vkAllocateCommandBuffers, device, bufferAllocInfo, commandBuffers);

  // Create Vertex Buffer
  const vertexBuffer = createVertexBuffer(device, physicalDevice, vertices);

  const bufferBeginInfo = new VkCommandBufferBeginInfo({
    sType: VkStructureType.VK_STRUCTURE_TYPE_COMMAND_BUFFER_BEGIN_INFO,
    flags: VK_COMMAND_BUFFER_USAGE_SIMULTANEOUS_USE_BIT,
    pInheritanceInfo: null
  });
  for(let i=0; i<commandBuffers.length; i+=1) {
    const buffer = commandBuffers[i];
    submit(vkBeginCommandBuffer, buffer, bufferBeginInfo);

    const clearValue = new VkClearValue();
    const renderPassBeginInfo = new VkRenderPassBeginInfo({
      sType: VkStructureType.VK_STRUCTURE_TYPE_RENDER_PASS_BEGIN_INFO,
      renderPass,
      framebuffer: frameBuffers[i],
      renderArea: new VkRect2D({
        offset: new VkOffset2D({
          x: 0,
          y: 0
        }),
        extent: getExtent2D(view)
      }),
      clearValueCount: 1,
      pClearValues: [clearValue]
    });

    vkCmdBeginRenderPass(buffer, renderPassBeginInfo, VK_SUBPASS_CONTENTS_INLINE);
    vkCmdBindPipeline(buffer, VK_PIPELINE_BIND_POINT_GRAPHICS, pipeline);
    vkCmdBindVertexBuffers(buffer, 0, 1, [vertexBuffer], new BigUint64Array([0n]));
    vkCmdDraw(buffer, vertices.length, 1, 0, 0);
    vkCmdEndRenderPass(buffer);
    submit(vkEndCommandBuffer, buffer);
  }
  return commandBuffers;
}
