import {
  VkPhysicalDevice,
  VkPhysicalDeviceFeatures,
  VkDeviceQueueCreateInfo,
  VkStructureType,
  VkDeviceCreateInfo,
  VK_KHR_SWAPCHAIN_EXTENSION_NAME,
  VkDevice,
  vkCreateDevice
} from "nvk";
import { getPhysicalDevice } from "./physical";
import { getQueue } from "./queue";
import { submit } from "../vulkan";

export function createDevice(physicalDevice: VkPhysicalDevice) {
  const device = new VkDevice();
  const deviceQueueInfo = new VkDeviceQueueCreateInfo({
    sType: VkStructureType.VK_STRUCTURE_TYPE_DEVICE_QUEUE_CREATE_INFO,
    queueFamilyIndex: 0,
    queueCount: 1,
    pQueuePriorities: new Float32Array([1.0, 1.0, 1.0, 1.0])
  });
  const deviceExtensions = [
    VK_KHR_SWAPCHAIN_EXTENSION_NAME.toString()
  ];
  const deviceInfo = new VkDeviceCreateInfo({
    sType: VkStructureType.VK_STRUCTURE_TYPE_DEVICE_CREATE_INFO,
    queueCreateInfoCount: 1,
    pQueueCreateInfos: [deviceQueueInfo],
    enabledExtensionCount: deviceExtensions.length,
    ppEnabledExtensionNames: deviceExtensions,
    pEnabledFeatures: new VkPhysicalDeviceFeatures()
  });

  submit(vkCreateDevice, physicalDevice, deviceInfo, null, device);

  return device;
}

export {
  getPhysicalDevice,
  getQueue
}
