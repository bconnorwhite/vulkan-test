import {
  vkCreateFramebuffer,
  VkDevice,
  VkFramebuffer,
  VkFramebufferCreateInfo,
  VkImageView,
  VkRenderPass,
  VkStructureType
} from "nvk";
import { View } from "../view";
import { submit } from "../vulkan";

export function createFrameBuffers(
  view: View,
  device: VkDevice,
  imageViews: VkImageView[],
  renderPass: VkRenderPass | null | undefined
) {
  const frameBuffers = [...Array(imageViews.length)].map(() => new VkFramebuffer());
  for(let i=0; i<imageViews.length; i+=1) {
    const framebufferInfo = new VkFramebufferCreateInfo({
      sType: VkStructureType.VK_STRUCTURE_TYPE_FRAMEBUFFER_CREATE_INFO,
      renderPass,
      attachmentCount: 1,
      pAttachments: [imageViews[i]],
      width: view.width,
      height: view.height,
      layers: 1
    })
    submit(vkCreateFramebuffer, device, framebufferInfo, null, frameBuffers[i]);
  }
  return frameBuffers;
}
