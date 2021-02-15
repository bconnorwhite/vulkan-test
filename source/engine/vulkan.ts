import { VkResult, VK_SUCCESS } from "nvk";

export function submit<T extends Array<any>>(action: (...a: T) => VkResult, ...args: T): void {
  const result = action(...args);
  if(result !== VK_SUCCESS) {
    throw new Error("Vulkan assertion failed!");
  }
}
