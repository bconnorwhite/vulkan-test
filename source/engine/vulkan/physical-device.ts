import {
  VkInstance,
  vkEnumeratePhysicalDevices,
  VkPhysicalDeviceProperties,
  vkGetPhysicalDeviceProperties,
  VkPhysicalDevice
} from "nvk";
import { submit } from ".";

function getDeviceProperties(physicalDevice: VkPhysicalDevice) {
  const deviceProperties = new VkPhysicalDeviceProperties();
  vkGetPhysicalDeviceProperties(physicalDevice, deviceProperties);
  return deviceProperties;
}

export function getDeviceName(physicalDevice: VkPhysicalDevice) {
  const { deviceName } = getDeviceProperties(physicalDevice);
  return deviceName;
}

function getDeviceCount(instance: VkInstance) {
  const deviceCount = { $: 0 };
  submit(vkEnumeratePhysicalDevices, instance, deviceCount, null);
  return deviceCount;
}

export function getPhysicalDevice(instance: VkInstance) {
  const deviceCount = getDeviceCount(instance);
  if(deviceCount.$ <= 0) {
    console.error("Error: No render devices available");
  }
  const devices = [...Array(deviceCount.$)].map(() => new VkPhysicalDevice());
  submit(vkEnumeratePhysicalDevices, instance, deviceCount, devices);
  return devices[0];
}
