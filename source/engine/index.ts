import {
  vkAcquireNextImageKHR,
  VkPresentInfoKHR,
  vkQueuePresentKHR,
  vkQueueSubmit,
  VkStructureType,
  VkSubmitInfo,
  VK_PIPELINE_STAGE_COLOR_ATTACHMENT_OUTPUT_BIT,
  VkDevice,
  VkSwapchainKHR,
  VulkanWindowInitializer,
  VkSemaphore,
  VkQueue,
  VkCommandBuffer
} from "nvk";
import { createWindow, View } from "./view";
import { setupVulkan, submit } from "./vulkan";
import { createSwapchain, getImageViews } from "./swapchain";
import { createCommandBuffers } from "./drawing/command-buffers";
import { createSemaphore } from "./drawing/semaphore";

type EngineParams = {
  view: VulkanWindowInitializer;
}

type Engine = {
  view: View;
  device: VkDevice;
  queue: VkQueue;
  swapchain: VkSwapchainKHR;
  commandBuffers: VkCommandBuffer[];
  imageAvailable: VkSemaphore;
  renderingAvailable: VkSemaphore;
}

const vertices = new Float32Array([
  -0.5, 0.0,
  0.0, 1.0,
  -1.0, 1.0,
  0.5, 0.0,
  1.0, 1.0,
  0.0, 1.0,
  0.0, -1.0,
  0.5, 0.0,
  -0.5, 0.0
]);

export function init(params: EngineParams): Engine {
  // Window
  const view = createWindow(params.view);
  // Setup
  const { instance, physicalDevice, device, queue } = setupVulkan(view);
  // Swapchain
  const swapchain = createSwapchain(view, instance, physicalDevice, device);
  const imageViews = getImageViews(device, swapchain);

  const commandBuffers = createCommandBuffers(
    view,
    device,
    physicalDevice,
    imageViews,
    vertices
  );
  const imageAvailable = createSemaphore(device);
  const renderingAvailable = createSemaphore(device);
  return {
    view,
    device,
    queue,
    swapchain,
    commandBuffers,
    imageAvailable,
    renderingAvailable
  }
}

function drawFrame({
  device,
  swapchain,
  commandBuffers,
  imageAvailable,
  renderingAvailable,
  queue
}: Engine) {
  const imageIndex = { $: 0 };
  submit(vkAcquireNextImageKHR, device, swapchain, Number.MAX_SAFE_INTEGER, imageAvailable, null, imageIndex);

  const submitInfo = new VkSubmitInfo({
    sType: VkStructureType.VK_STRUCTURE_TYPE_SUBMIT_INFO,
    waitSemaphoreCount: 1,
    pWaitSemaphores: [imageAvailable],
    pWaitDstStageMask: new Int32Array([
      VK_PIPELINE_STAGE_COLOR_ATTACHMENT_OUTPUT_BIT
    ]),
    commandBufferCount: 1,
    pCommandBuffers: [commandBuffers[imageIndex.$]],
    signalSemaphoreCount: 1,
    pSignalSemaphores: [renderingAvailable]
  });

  submit(vkQueueSubmit, queue, 1, [submitInfo], null);

  const presentInfo = new VkPresentInfoKHR({
    sType: VkStructureType.VK_STRUCTURE_TYPE_PRESENT_INFO_KHR,
    waitSemaphoreCount: 1,
    pWaitSemaphores: [renderingAvailable],
    swapchainCount: 1,
    pSwapchains: [swapchain],
    pImageIndices: new Uint32Array([imageIndex.$]),
    pResults: null
  });

  submit(vkQueuePresentKHR, queue, presentInfo); // TODO: onresize()
}

export function render(engine: Engine, rate = 1) {
  drawFrame(engine);
  engine.view.pollEvents?.();
  if(engine.view.shouldClose?.() === false) {
    setTimeout(() => render(engine, rate), 1000 / rate);
  }
}
