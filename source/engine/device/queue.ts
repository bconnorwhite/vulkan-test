import { VkDevice, VkQueue, vkGetDeviceQueue } from "nvk";

export function getQueue(device: VkDevice) {
  const queue = new VkQueue();
  vkGetDeviceQueue(device, 0, 0, queue);
  return queue;
}
