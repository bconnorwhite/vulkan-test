import {
  VkStructureType,
  VkDevice,
  VK_FORMAT_B8G8R8A8_UNORM,
  VkSwapchainKHR,
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
import { submit } from "../vulkan";

function getImageCount(device: VkDevice, swapchain: VkSwapchainKHR) {
  const imageCount = { $: 0 };
  submit(vkGetSwapchainImagesKHR, device, swapchain, imageCount, null);
  return imageCount;
}

function getSwapchainImages(device: VkDevice, swapchain: VkSwapchainKHR, imageCount: VkInout) {
  const swapchainImages = [...Array(imageCount.$)].map(() => new VkImage());
  submit(vkGetSwapchainImagesKHR, device, swapchain, imageCount, swapchainImages);
  return swapchainImages;
}

export function getImageViews(device: VkDevice, swapchain: VkSwapchainKHR) {
  const imageCount = getImageCount(device, swapchain);
  const swapchainImages = getSwapchainImages(device, swapchain, imageCount);
  const imageViews = [...Array(imageCount.$)].map(() => new VkImageView());
  for(let i=0; i<imageCount.$; i+=1) {
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
