import { vkCreateSemaphore, VkDevice, VkSemaphore, VkSemaphoreCreateInfo, VkStructureType } from "nvk";
import { submit } from "../vulkan";

const semaphoreInfo = new VkSemaphoreCreateInfo({
  sType: VkStructureType.VK_STRUCTURE_TYPE_SEMAPHORE_CREATE_INFO
});

export function createSemaphore(device: VkDevice) {
  const semaphore = new VkSemaphore();
  submit(vkCreateSemaphore, device, semaphoreInfo, null, semaphore);
  return semaphore;
}
