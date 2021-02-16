import {
  VkInstance,
  VkPhysicalDevice,
  VkSwapchainCreateInfoKHR,
  VkStructureType,
  VkDevice,
  VK_COLOR_SPACE_SRGB_NONLINEAR_KHR,
  VK_COMPOSITE_ALPHA_OPAQUE_BIT_KHR,
  VK_FORMAT_B8G8R8A8_UNORM,
  VK_IMAGE_USAGE_COLOR_ATTACHMENT_BIT,
  VK_PRESENT_MODE_FIFO_KHR,
  VK_SHARING_MODE_EXCLUSIVE,
  VK_SURFACE_TRANSFORM_IDENTITY_BIT_KHR,
  vkCreateSwapchainKHR,
  VkSwapchainKHR
} from "nvk";
import { View, getExtent2D } from "../view";
import { submit } from "../vulkan";
import { createSurface, checkSurfaceSupport, getSurfaceCapabilities } from "./surface";
import { getImageViews } from "./image-views";

export function createSwapchain(view: View, instance: VkInstance, physicalDevice: VkPhysicalDevice, device: VkDevice) {
  const surface = createSurface(view, instance);
  let minImageCount = 0; // 3
  if(surface) {
    checkSurfaceSupport(physicalDevice, surface);
    const capabilities = getSurfaceCapabilities(physicalDevice, surface);
    minImageCount = capabilities.minImageCount + 1;
  }
  const swapchain = new VkSwapchainKHR();
  const swapchainInfo = new VkSwapchainCreateInfoKHR({
    sType: VkStructureType.VK_STRUCTURE_TYPE_SWAPCHAIN_CREATE_INFO_KHR,
    surface,
    minImageCount,
    imageFormat: VK_FORMAT_B8G8R8A8_UNORM,
    imageColorSpace: VK_COLOR_SPACE_SRGB_NONLINEAR_KHR,
    imageExtent: getExtent2D(view),
    imageArrayLayers: 1,
    imageUsage: VK_IMAGE_USAGE_COLOR_ATTACHMENT_BIT,
    imageSharingMode: VK_SHARING_MODE_EXCLUSIVE,
    queueFamilyIndexCount: 0,
    preTransform: VK_SURFACE_TRANSFORM_IDENTITY_BIT_KHR,
    compositeAlpha: VK_COMPOSITE_ALPHA_OPAQUE_BIT_KHR,
    presentMode: VK_PRESENT_MODE_FIFO_KHR,
    clipped: true,
    oldSwapchain: null
  });
  submit(vkCreateSwapchainKHR, device, swapchainInfo, null, swapchain);

  return swapchain;
}

export {
  getImageViews
}
