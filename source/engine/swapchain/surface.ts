import {
  VkInstance,
  VkSurfaceKHR,
  VkPhysicalDevice,
  vkGetPhysicalDeviceSurfaceSupportKHR,
  vkGetPhysicalDeviceSurfaceCapabilitiesKHR,
  VkSurfaceCapabilitiesKHR
} from "nvk";
import { View } from "../view";
import { submit } from "../vulkan";

export function checkSurfaceSupport(physicalDevice: VkPhysicalDevice, surface: VkSurfaceKHR) {
  const surfaceSupport = { $: false };
  submit(vkGetPhysicalDeviceSurfaceSupportKHR, physicalDevice, 0, surface, surfaceSupport);
  if(!surfaceSupport) {
    console.error("No surface creation support!");
  }
}

export function getSurfaceCapabilities(physicalDevice: VkPhysicalDevice, surface: VkSurfaceKHR) {
  const capabilities = new VkSurfaceCapabilitiesKHR();
  submit(vkGetPhysicalDeviceSurfaceCapabilitiesKHR, physicalDevice, surface, capabilities);
  return capabilities;
}

export function createSurface(view: View, instance: VkInstance) {
  if(view.createSurface) {
    const surface = new VkSurfaceKHR();
    view.createSurface(instance, null, surface);
    return surface;
  } else {
    return null;
  }
}
