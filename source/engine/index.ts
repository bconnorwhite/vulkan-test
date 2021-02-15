import {
  VulkanWindow,
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
import { submit } from "./vulkan";
import { createWindow } from "./window";
import { createInstance } from "./instance";
import { getPhysicalDevice, createDevice, getQueue } from "./device";
import { createSurface } from "./surface";
import { createSwapchain, getAmountOfImagesInSwapchain, getImageViews } from "./swapchain";
import { createRenderPass } from "./render-pass";
import { createCommandBuffers } from "./command";
import { createSemaphore } from "./semaphore";

type EngineParams = {
  window: VulkanWindowInitializer;
}

type Engine = {
  window: VulkanWindow;
  device: VkDevice;
  queue: VkQueue;
  swapchain: VkSwapchainKHR;
  commandBuffers: VkCommandBuffer[];
  imageAvailable: VkSemaphore;
  renderingAvailable: VkSemaphore;
}

export function init(params: EngineParams): Engine {
  const window = createWindow({
    title: "Triangle",
    width: 480,
    height: 320
  });
  const instance = createInstance(window, params.window.title);
  const physicalDevice = getPhysicalDevice(instance);
  const device = createDevice(physicalDevice);
  const queue = getQueue(device);
  const surface = createSurface(window, instance, physicalDevice);
  const swapchain = createSwapchain(window, device, surface);
  const amountOfImagesInSwapchain = getAmountOfImagesInSwapchain(device, swapchain);
  const imageViews = getImageViews(device, swapchain, amountOfImagesInSwapchain);
  const renderPass = createRenderPass(device);
  const commandBuffers = createCommandBuffers(window, device, physicalDevice, amountOfImagesInSwapchain, imageViews, renderPass);
  const imageAvailable = createSemaphore(device);
  const renderingAvailable = createSemaphore(device);
  return {
    window,
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

  submit(vkAcquireNextImageKHR, device, swapchain, Number.MAX_SAFE_INTEGER, imageAvailable, null, imageIndex)

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

  submit(vkQueuePresentKHR, queue, presentInfo);
}

export function render(engine: Engine) {
  drawFrame(engine);
  engine.window.pollEvents();
  return !engine.window.shouldClose();
}
