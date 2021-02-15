import {
  VulkanWindow,
  VkApplicationInfo,
  VkStructureType,
  VK_MAKE_VERSION,
  VK_API_VERSION_1_0,
  VkInstanceCreateInfo,
  VkInstance,
  vkCreateInstance
} from "nvk";
import { submit } from "./vulkan";

export function createInstance(window: VulkanWindow, pApplicationName?: string) {
  const instanceExtensions = window.getRequiredInstanceExtensions();
  const validationLayers: string[] = [];
  const instanceInfo = new VkInstanceCreateInfo({
    sType: VkStructureType.VK_STRUCTURE_TYPE_INSTANCE_CREATE_INFO,
    pApplicationInfo: new VkApplicationInfo({
      sType: VkStructureType.VK_STRUCTURE_TYPE_APPLICATION_INFO,
      pApplicationName,
      applicationVersion: VK_MAKE_VERSION(1, 0, 0),
      pEngineName: "No Engine",
      engineVersion: VK_MAKE_VERSION(1, 0, 0),
      apiVersion: VK_API_VERSION_1_0
    }),
    enabledExtensionCount: instanceExtensions.length,
    ppEnabledExtensionNames: instanceExtensions,
    enabledLayerCount: validationLayers.length,
    ppEnabledLayerNames: validationLayers
  });
  const instance = new VkInstance();
  submit(vkCreateInstance, instanceInfo, null, instance);
  return instance;
}


