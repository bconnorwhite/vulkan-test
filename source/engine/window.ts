import {
  VulkanWindowInitializer,
  VulkanWindow,
  VkExtent2D
} from "nvk";

export function createWindow(params: VulkanWindowInitializer) {
  const window = new VulkanWindow(params);
  return window;
}

export function getExtent2D(window: VulkanWindow) {
  return new VkExtent2D({
    width: window.width,
    height: window.height
  });
}

