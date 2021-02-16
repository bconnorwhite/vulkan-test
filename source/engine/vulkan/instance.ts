import {
  VkApplicationInfo,
  VkStructureType,
  VK_MAKE_VERSION,
  VK_API_VERSION_1_0,
  VkInstanceCreateInfo,
  VkInstance,
  vkCreateInstance
} from "nvk";
import { View } from "../view";
import { submit } from "./";

export function createInstance(view: View) {
  const instanceExtensions = view.getRequiredInstanceExtensions();
  const instanceInfo = new VkInstanceCreateInfo({
    sType: VkStructureType.VK_STRUCTURE_TYPE_INSTANCE_CREATE_INFO,
    pApplicationInfo: new VkApplicationInfo({
      sType: VkStructureType.VK_STRUCTURE_TYPE_APPLICATION_INFO,
      pApplicationName: null,
      applicationVersion: VK_MAKE_VERSION(1, 0, 0),
      pEngineName: "No Engine",
      engineVersion: VK_MAKE_VERSION(1, 0, 0),
      apiVersion: VK_API_VERSION_1_0
    }),
    enabledExtensionCount: instanceExtensions.length,
    ppEnabledExtensionNames: instanceExtensions
  });
  const instance = new VkInstance();
  submit(vkCreateInstance, instanceInfo, null, instance);
  return instance;
}
