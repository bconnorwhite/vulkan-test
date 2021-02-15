import {
  VulkanWindow,
  VkInstance,
  vkGetPhysicalDeviceSurfaceCapabilitiesKHR,
  vkGetPhysicalDeviceSurfaceFormatsKHR,
  VkSurfaceCapabilitiesKHR,
  VkSurfaceKHR,
  VkSurfaceFormatKHR,
  VkPhysicalDevice,
  vkGetPhysicalDeviceSurfaceSupportKHR
} from "nvk";
import { submit } from "./vulkan";

function checkSurfaceSupport(surface: VkSurfaceKHR, physicalDevice: VkPhysicalDevice) {
  const surfaceSupport = { $: false };
  submit(vkGetPhysicalDeviceSurfaceSupportKHR, physicalDevice, 0, surface, surfaceSupport);
  if(!surfaceSupport) {
    console.error("No surface creation support!");
  }
}

export function createSurface(window: VulkanWindow, instance: VkInstance, physicalDevice: VkPhysicalDevice) {
  const surface = new VkSurfaceKHR();
  window.createSurface(instance, null, surface);

  const surfaceCapabilities = new VkSurfaceCapabilitiesKHR();
  submit(vkGetPhysicalDeviceSurfaceCapabilitiesKHR, physicalDevice, surface, surfaceCapabilities);

  const surfaceFormatCount = { $: 0 };
  submit(vkGetPhysicalDeviceSurfaceFormatsKHR, physicalDevice, surface, surfaceFormatCount, null);
  const surfaceFormats = [...Array(surfaceFormatCount.$)].map(() => new VkSurfaceFormatKHR());
  submit(vkGetPhysicalDeviceSurfaceFormatsKHR, physicalDevice, surface, surfaceFormatCount, surfaceFormats);

  checkSurfaceSupport(surface, physicalDevice);

  return surface;
}
