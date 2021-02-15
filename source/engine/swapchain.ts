import {
  VkSwapchainCreateInfoKHR,
  VkStructureType,
  VkSurfaceKHR,
  VkDevice,
  VK_COLOR_SPACE_SRGB_NONLINEAR_KHR,
  VK_COMPOSITE_ALPHA_OPAQUE_BIT_KHR,
  VK_FORMAT_B8G8R8A8_UNORM,
  VK_IMAGE_USAGE_COLOR_ATTACHMENT_BIT,
  VK_PRESENT_MODE_FIFO_KHR,
  VK_SHARING_MODE_EXCLUSIVE,
  VK_SURFACE_TRANSFORM_IDENTITY_BIT_KHR,
  vkCreateSwapchainKHR,
  VkSwapchainKHR,
  VulkanWindow,
  vkGetSwapchainImagesKHR,
  VkInout,
  VkImage,
  VkImageView,
  VkImageViewCreateInfo,
  VK_IMAGE_VIEW_TYPE_2D,
  VkImageSubresourceRange,
  VK_IMAGE_ASPECT_COLOR_BIT,
  vkCreateImageView
} from "nvk";
import { getExtent2D } from "./window";
import { submit } from "./vulkan";

export function getAmountOfImagesInSwapchain(device: VkDevice, swapchain: VkSwapchainKHR) {
  const amountOfImagesInSwapchain = { $: 0 };
  vkGetSwapchainImagesKHR(device, swapchain, amountOfImagesInSwapchain, null);
  return amountOfImagesInSwapchain;
}

function getSwapchainImages(device: VkDevice, swapchain: VkSwapchainKHR, amountOfImagesInSwapchain: VkInout) {
  const swapchainImages = [...Array(amountOfImagesInSwapchain.$)].map(() => new VkImage());
  submit(vkGetSwapchainImagesKHR, device, swapchain, amountOfImagesInSwapchain, swapchainImages);
  return swapchainImages;
}

export function getImageViews(device: VkDevice, swapchain: VkSwapchainKHR, amountOfImagesInSwapchain: VkInout) {
  const swapchainImages = getSwapchainImages(device, swapchain, amountOfImagesInSwapchain);
  const imageViews = [...Array(amountOfImagesInSwapchain.$)].map(() => new VkImageView());
  for(let i=0; i<amountOfImagesInSwapchain.$; i+=1) {
    const imageViewInfo = new VkImageViewCreateInfo({
      sType: VkStructureType.VK_STRUCTURE_TYPE_IMAGE_VIEW_CREATE_INFO,
      image: swapchainImages[i],
      viewType: VK_IMAGE_VIEW_TYPE_2D,
      format: VK_FORMAT_B8G8R8A8_UNORM,
      subresourceRange: new VkImageSubresourceRange({
        aspectMask: VK_IMAGE_ASPECT_COLOR_BIT,
        baseMipLevel: 0,
        levelCount: 1,
        baseArrayLayer: 0,
        layerCount: 1
      })
    });
    submit(vkCreateImageView, device, imageViewInfo, null, imageViews[i]);
  }
  return imageViews;
}

export function createSwapchain(window: VulkanWindow, device: VkDevice, surface: VkSurfaceKHR) {
  const swapchain = new VkSwapchainKHR();
  const swapchainInfo = new VkSwapchainCreateInfoKHR({
    sType: VkStructureType.VK_STRUCTURE_TYPE_SWAPCHAIN_CREATE_INFO_KHR,
    surface,
    minImageCount: 3,
    imageFormat: VK_FORMAT_B8G8R8A8_UNORM,
    imageColorSpace: VK_COLOR_SPACE_SRGB_NONLINEAR_KHR,
    imageExtent: getExtent2D(window),
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
