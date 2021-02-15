import {
  VkInstance,
  vkEnumeratePhysicalDevices,
  vkGetPhysicalDeviceFeatures,
  VkPhysicalDevice,
  VkPhysicalDeviceFeatures,
  VkPhysicalDeviceProperties,
  vkGetPhysicalDeviceProperties,
  VkPhysicalDeviceMemoryProperties,
  vkGetPhysicalDeviceMemoryProperties,
  vkGetPhysicalDeviceQueueFamilyProperties,
  VkQueueFamilyProperties
} from "nvk";
import { submit } from "../vulkan";

function getDeviceFeatures(physicalDevice: VkPhysicalDevice) {
  const deviceFeatures = new VkPhysicalDeviceFeatures();
  vkGetPhysicalDeviceFeatures(physicalDevice, deviceFeatures);
  return deviceFeatures;
}

function getDeviceProperties(physicalDevice: VkPhysicalDevice) {
  const deviceProperties = new VkPhysicalDeviceProperties();
  vkGetPhysicalDeviceProperties(physicalDevice, deviceProperties);
  return deviceProperties;
}

function getDeviceMemoryProperties(physicalDevice: VkPhysicalDevice) {
  const deviceMemoryProperties = new VkPhysicalDeviceMemoryProperties();
  vkGetPhysicalDeviceMemoryProperties(physicalDevice, deviceMemoryProperties);
  return deviceMemoryProperties;
}

function getQueueFamilyCount(physicalDevice: VkPhysicalDevice) {
  const queueFamilyCount = { $: 0 };
  vkGetPhysicalDeviceQueueFamilyProperties(physicalDevice, queueFamilyCount, null);
  return queueFamilyCount;
}

function getQueueFamilies(physicalDevice: VkPhysicalDevice) {
  const queueFamilyCount = getQueueFamilyCount(physicalDevice);
  const queueFamilies = [...Array(queueFamilyCount.$)].map(() => new VkQueueFamilyProperties());
  vkGetPhysicalDeviceQueueFamilyProperties(physicalDevice, queueFamilyCount, queueFamilies);
  return queueFamilies;
}

export function getPhysicalDevice(instance: VkInstance) {
  const deviceCount = { $: 0 };
  submit(vkEnumeratePhysicalDevices, instance, deviceCount, null);
  if(deviceCount.$ <= 0) {
    console.error("Error: No render devices available");
  }
  const devices = [...Array(deviceCount.$)].map(() => new VkPhysicalDevice());
  submit(vkEnumeratePhysicalDevices, instance, deviceCount, devices);
  const physicalDevice = devices[0];

  getDeviceFeatures(physicalDevice); // ?

  const { deviceName } = getDeviceProperties(physicalDevice);
  console.info(`Using device: ${deviceName}`);

  getDeviceMemoryProperties(physicalDevice); // ?
  getQueueFamilies(physicalDevice); // ?

  return physicalDevice;
}
