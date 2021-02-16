import {
  VkDevice,
  VkInstance,
  VkPhysicalDevice,
  VkQueue,
  VkResult,
  VK_SUCCESS
} from "nvk";
import { View } from "../view";
import { createInstance } from "./instance";
import { getPhysicalDevice, getDeviceName } from "./physical-device";
import { createDevice } from "./device";
import { getQueue } from "./queue";

export type Vulkan = {
  instance: VkInstance;
  physicalDevice: VkPhysicalDevice;
  device: VkDevice;
  queue: VkQueue;
}

export function submit<T extends Array<any>>(action: (...a: T) => VkResult, ...args: T): void {
  const result = action(...args);
  if(result !== VK_SUCCESS) {
    throw new Error("Vulkan assertion failed!");
  }
}

export function setupVulkan(view: View) {
  const instance = createInstance(view);
  const physicalDevice = getPhysicalDevice(instance);
  const deviceName = getDeviceName(physicalDevice);
  console.info(`Using device: ${deviceName}`);
  const device = createDevice(physicalDevice);
  const queue = getQueue(device);
  return {
    instance,
    physicalDevice,
    device,
    queue
  }
}
