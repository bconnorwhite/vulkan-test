/* eslint-disable max-lines */
// import { readFileSync } from "fs";
// import {
//   VkStructureType,
//   VkResult,
//   vkEnumerateInstanceLayerProperties,
//   VkLayerProperties,
//   VkBuffer,
//   VkDeviceMemory,
//   VkVertexInputBindingDescription,
//   VK_VERTEX_INPUT_RATE_VERTEX,
//   VkVertexInputAttributeDescription,
//   VK_FORMAT_R32G32_SFLOAT,
//   VK_SUCCESS,
//   VkShaderModuleCreateInfo,
//   vkCreateShaderModule,
//   VkShaderModule,
//   VkPhysicalDeviceMemoryProperties,
//   vkGetPhysicalDeviceMemoryProperties,
//   VkMemoryPropertyFlagBits,
//   VkBufferCreateInfo,
//   VK_BUFFER_USAGE_VERTEX_BUFFER_BIT,
//   VK_SHARING_MODE_EXCLUSIVE,
//   vkCreateBuffer,
//   VkMemoryRequirements,
//   vkGetBufferMemoryRequirements,
//   VK_MEMORY_PROPERTY_HOST_VISIBLE_BIT,
//   VK_MEMORY_PROPERTY_HOST_COHERENT_BIT,
//   VkMemoryAllocateInfo,
//   vkAllocateMemory,
//   vkBindBufferMemory,
//   vkUnmapMemory,
//   vkMapMemory,
//   VkSwapchainKHR,
//   VkPipelineLayout,
//   VkRenderPass,
//   VkPipeline,
//   VkCommandPool,
//   VkSemaphore,
//   VkSwapchainCreateInfoKHR,
//   VK_FORMAT_B8G8R8A8_UNORM,
//   VK_COLOR_SPACE_SRGB_NONLINEAR_KHR,
//   VkExtent2D,
//   VK_IMAGE_USAGE_COLOR_ATTACHMENT_BIT,
//   VK_SURFACE_TRANSFORM_IDENTITY_BIT_KHR,
//   VK_COMPOSITE_ALPHA_OPAQUE_BIT_KHR,
//   VK_PRESENT_MODE_FIFO_KHR,
//   vkCreateSwapchainKHR,
//   vkGetSwapchainImagesKHR,
//   VkImage,
//   VkImageView,
//   VkImageViewCreateInfo,
//   VK_IMAGE_VIEW_TYPE_2D,
//   VK_IMAGE_ASPECT_COLOR_BIT,
//   VkImageSubresourceRange,
//   vkCreateImageView,
//   VkPipelineShaderStageCreateInfo,
//   VK_SHADER_STAGE_VERTEX_BIT,
//   VK_SHADER_STAGE_FRAGMENT_BIT,
//   VkPipelineVertexInputStateCreateInfo,
//   VkPipelineInputAssemblyStateCreateInfo,
//   VK_PRIMITIVE_TOPOLOGY_TRIANGLE_LIST,
//   VkViewport,
//   VkRect2D,
//   VkOffset2D,
//   VkPipelineViewportStateCreateInfo,
//   VkPipelineRasterizationStateCreateInfo,
//   VK_POLYGON_MODE_FILL,
//   VK_CULL_MODE_BACK_BIT,
//   VK_FRONT_FACE_CLOCKWISE,
//   VkPipelineMultisampleStateCreateInfo,
//   VK_SAMPLE_COUNT_1_BIT,
//   VkPipelineColorBlendAttachmentState,
//   VK_BLEND_FACTOR_SRC_ALPHA,
//   VK_BLEND_FACTOR_ONE_MINUS_SRC_ALPHA,
//   VK_BLEND_OP_ADD,
//   VK_BLEND_FACTOR_ONE,
//   VK_BLEND_FACTOR_ZERO,
//   VK_COLOR_COMPONENT_R_BIT,
//   VK_COLOR_COMPONENT_G_BIT,
//   VK_COLOR_COMPONENT_B_BIT,
//   VK_COLOR_COMPONENT_A_BIT,
//   VK_LOGIC_OP_NO_OP,
//   VkPipelineColorBlendStateCreateInfo,
//   VkPipelineLayoutCreateInfo,
//   vkCreatePipelineLayout,
//   VkAttachmentDescription,
//   vkAllocateCommandBuffers,
//   VkAttachmentReference,
//   vkBeginCommandBuffer,
//   VkClearValue,
//   vkCmdBeginRenderPass,
//   vkCmdBindPipeline,
//   vkCmdBindVertexBuffers,
//   vkCmdDraw,
//   vkCmdEndRenderPass,
//   VkCommandBuffer,
//   VkCommandBufferAllocateInfo,
//   VkCommandBufferBeginInfo,
//   VkCommandPoolCreateInfo,
//   vkCreateCommandPool,
//   vkCreateFramebuffer,
//   vkCreateGraphicsPipelines,
//   vkCreateRenderPass,
//   vkCreateSemaphore,
//   vkEndCommandBuffer,
//   VkFramebuffer,
//   VkFramebufferCreateInfo,
//   VkGraphicsPipelineCreateInfo,
//   VkRenderPassBeginInfo,
//   VkRenderPassCreateInfo,
//   VkSemaphoreCreateInfo,
//   VkSubpassDependency,
//   VkSubpassDescription,
//   VK_ACCESS_COLOR_ATTACHMENT_READ_BIT,
//   VK_ACCESS_COLOR_ATTACHMENT_WRITE_BIT,
//   VK_ATTACHMENT_LOAD_OP_CLEAR,
//   VK_ATTACHMENT_LOAD_OP_DONT_CARE,
//   VK_ATTACHMENT_STORE_OP_DONT_CARE,
//   VK_ATTACHMENT_STORE_OP_STORE,
//   VK_COMMAND_BUFFER_LEVEL_PRIMARY,
//   VK_COMMAND_BUFFER_USAGE_SIMULTANEOUS_USE_BIT,
//   VK_IMAGE_LAYOUT_COLOR_ATTACHMENT_OPTIMAL,
//   VK_IMAGE_LAYOUT_PRESENT_SRC_KHR,
//   VK_IMAGE_LAYOUT_UNDEFINED,
//   VK_PIPELINE_BIND_POINT_GRAPHICS,
//   VK_PIPELINE_STAGE_COLOR_ATTACHMENT_OUTPUT_BIT,
//   VK_SUBPASS_CONTENTS_INLINE,
//   VK_SUBPASS_EXTERNAL,
//   vkAcquireNextImageKHR,
//   VkSubmitInfo,
//   vkQueueSubmit,
//   VkPresentInfoKHR,
//   vkQueuePresentKHR
// } from "nvk";
// import { GLSL } from "nvk-essentials";

// import { createWindow } from "./engine/window";

// let result: VkResult | null = null;

// const pipelineLayout = new VkPipelineLayout();
// const pipeline = new VkPipeline();
// const semaphoreImageAvailable = new VkSemaphore();
// const semaphoreRenderingAvailable = new VkSemaphore();

// const window = createWindow({
//   title: "Triangle",
//   width: 480,
//   height: 320
// });

// *


// const vertexInputInfo = new VkPipelineVertexInputStateCreateInfo({
//   sType: VkStructureType.VK_STRUCTURE_TYPE_PIPELINE_VERTEX_INPUT_STATE_CREATE_INFO,
//   vertexBindingDescriptionCount: 1,
//   pVertexBindingDescriptions: [posVertexBindingDescr],
//   vertexAttributeDescriptionCount: 1,
//   pVertexAttributeDescriptions: [posVertexAttrDescr]
// });

// const inputAssemblyStateInfo = new VkPipelineInputAssemblyStateCreateInfo({
//   sType: VkStructureType.VK_STRUCTURE_TYPE_PIPELINE_INPUT_ASSEMBLY_STATE_CREATE_INFO,
//   topology: VK_PRIMITIVE_TOPOLOGY_TRIANGLE_LIST,
//   primitiveRestartEnable: false
// });


// const colorBlendInfo = new VkPipelineColorBlendStateCreateInfo({
//   sType: VkStructureType.VK_STRUCTURE_TYPE_PIPELINE_COLOR_BLEND_STATE_CREATE_INFO,
//   logicOpEnable: false,
//   logicOp: VK_LOGIC_OP_NO_OP,
//   attachmentCount: 1,
//   pAttachments: [colorBlendAttachment],
//   blendConstants: [0.0, 0.0, 0.0, 0.0]
// });

// const graphicsPipelineInfo = new VkGraphicsPipelineCreateInfo({
//   sType: VkStructureType.VK_STRUCTURE_TYPE_GRAPHICS_PIPELINE_CREATE_INFO,
//   stageCount: shaderStages.length,
//   pStages: shaderStages,
//   pVertexInputState: vertexInputInfo,
//   pInputAssemblyState: inputAssemblyStateInfo,
//   pTessellationState: null,
//   pViewportState: viewportStateInfo,
//   pRasterizationState: rasterizationInfo,
//   pMultisampleState: multisampleInfo,
//   pDepthStencilState: null,
//   pColorBlendState: colorBlendInfo,
//   pDynamicState: null,
//   layout: pipelineLayout,
//   renderPass,
//   subpass: 0,
//   basePipelineHandle: null,
//   basePipelineIndex: -1
// });

// result = vkCreateGraphicsPipelines(device, null, 1, [graphicsPipelineInfo], null, [pipeline]);
// assertVKResult(result);

// const framebuffers = [...Array(amountOfImagesInSwapchain.$)].map(() => new VkFramebuffer());
// for(let i=0; i<amountOfImagesInSwapchain.$; i+=1) {
//   const framebufferInfo = new VkFramebufferCreateInfo({
//     sType: VkStructureType.VK_STRUCTURE_TYPE_FRAMEBUFFER_CREATE_INFO,
//     renderPass,
//     attachmentCount: 1,
//     pAttachments: [imageViews[i]],
//     width: window.width,
//     height: window.height,
//     layers: 1
//   });
//   result = vkCreateFramebuffer(device, framebufferInfo, null, framebuffers[i]);
//   assertVKResult(result);
// }

// const cmdPoolInfo = new VkCommandPoolCreateInfo({
//   flags: 0,
//   sType: VkStructureType.VK_STRUCTURE_TYPE_COMMAND_POOL_CREATE_INFO,
//   queueFamilyIndex: 0
// });

// result = vkCreateCommandPool(device, cmdPoolInfo, null, cmdPool);
// assertVKResult(result);

// const cmdBufferAllocInfo = new VkCommandBufferAllocateInfo({
//   sType: VkStructureType.VK_STRUCTURE_TYPE_COMMAND_BUFFER_ALLOCATE_INFO,
//   commandPool: cmdPool,
//   level: VK_COMMAND_BUFFER_LEVEL_PRIMARY,
//   commandBufferCount: amountOfImagesInSwapchain.$
// });

// const cmdBuffers = [...Array(amountOfImagesInSwapchain.$)].map(() => new VkCommandBuffer());

// result = vkAllocateCommandBuffers(device, cmdBufferAllocInfo, cmdBuffers);
// assertVKResult(result);

// const cmdBufferBeginInfo = new VkCommandBufferBeginInfo({
//   sType: VkStructureType.VK_STRUCTURE_TYPE_COMMAND_BUFFER_BEGIN_INFO,
//   flags: VK_COMMAND_BUFFER_USAGE_SIMULTANEOUS_USE_BIT,
//   pInheritanceInfo: null
// });

// createVertexBuffer(vertexBuffer, vertexBufferMemory, vertices.byteLength);

// for(let i=0; i<cmdBuffers.length; i+=1) {
//   const cmdBuffer = cmdBuffers[i];
//   result = vkBeginCommandBuffer(cmdBuffer, cmdBufferBeginInfo);
//   assertVKResult(result);

//   const clearValue = new VkClearValue();

//   const renderPassBeginInfo = new VkRenderPassBeginInfo({
//     sType: VkStructureType.VK_STRUCTURE_TYPE_RENDER_PASS_BEGIN_INFO,
//     renderPass,
//     framebuffer: framebuffers[i],
//     renderArea: new VkRect2D({
//       offset: new VkOffset2D({
//         x: 0,
//         y: 0
//       }),
//       extent: new VkExtent2D({
//         width: window.width,
//         height: window.height
//       })
//     }),
//     clearValueCount: 1,
//     pClearValues: [clearValue]
//   });

//   vkCmdBeginRenderPass(cmdBuffer, renderPassBeginInfo, VK_SUBPASS_CONTENTS_INLINE);

//   vkCmdBindPipeline(cmdBuffer, VK_PIPELINE_BIND_POINT_GRAPHICS, pipeline);

//   vkCmdBindVertexBuffers(cmdBuffer, 0, 1, [vertexBuffer], new BigUint64Array([0n]));

//   vkCmdDraw(cmdBuffer, 3, 1, 0, 0);

//   vkCmdEndRenderPass(cmdBuffer);

//   result = vkEndCommandBuffer(cmdBuffer);
//   assertVKResult(result);
// }

// const semaphoreInfo = new VkSemaphoreCreateInfo({
//   sType: VkStructureType.VK_STRUCTURE_TYPE_SEMAPHORE_CREATE_INFO
// });

// result = vkCreateSemaphore(device, semaphoreInfo, null, semaphoreImageAvailable);
// assertVKResult(result);
// result = vkCreateSemaphore(device, semaphoreInfo, null, semaphoreRenderingAvailable);
// assertVKResult(result);

// function drawFrame() {
//   const imageIndex = { $: 0 };

//   result = vkAcquireNextImageKHR(device, swapchain, Number.MAX_SAFE_INTEGER, semaphoreImageAvailable, null, imageIndex);
//   assertVKResult(result);

//   const submitInfo = new VkSubmitInfo({
//     sType: VkStructureType.VK_STRUCTURE_TYPE_SUBMIT_INFO,
//     waitSemaphoreCount: 1,
//     pWaitSemaphores: [semaphoreImageAvailable],
//     pWaitDstStageMask: new Int32Array([
//       VK_PIPELINE_STAGE_COLOR_ATTACHMENT_OUTPUT_BIT
//     ]),
//     commandBufferCount: 1,
//     pCommandBuffers: [cmdBuffers[imageIndex.$]],
//     signalSemaphoreCount: 1,
//     pSignalSemaphores: [semaphoreRenderingAvailable]
//   });

//   result = vkQueueSubmit(queue, 1, [submitInfo], null);
//   assertVKResult(result);

//   const presentInfo = new VkPresentInfoKHR({
//     sType: VkStructureType.VK_STRUCTURE_TYPE_PRESENT_INFO_KHR,
//     waitSemaphoreCount: 1,
//     pWaitSemaphores: [semaphoreRenderingAvailable],
//     swapchainCount: 1,
//     pSwapchains: [swapchain],
//     pImageIndices: new Uint32Array([imageIndex.$]),
//     pResults: null
//   });

//   result = vkQueuePresentKHR(queue, presentInfo);
//   assertVKResult(result);
// }

// function assertVKResult(result: VkResult) {
//   if(result !== VK_SUCCESS) {
//     throw new Error("Vulkan assertion failed!");
//   }
// }


import { init, render } from "./engine";

const engine = init({
  window: {
    title: "Triangle",
    width: 480,
    height: 320
  }
});
(function drawLoop() {
  const state = render(engine);
  if(state) {
    setTimeout(drawLoop, 1000 / 60);
  }
}());
