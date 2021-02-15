import {
  vkAllocateMemory,
  vkBindBufferMemory,
  VkBuffer,
  VkBufferCreateInfo,
  vkCreateBuffer,
  VkDevice,
  VkDeviceMemory,
  vkGetBufferMemoryRequirements,
  vkGetPhysicalDeviceMemoryProperties,
  vkMapMemory,
  VkMemoryAllocateInfo,
  VkMemoryRequirements,
  VkPhysicalDevice,
  VkPhysicalDeviceMemoryProperties,
  VkStructureType,
  vkUnmapMemory,
  VK_BUFFER_USAGE_VERTEX_BUFFER_BIT,
  VK_MEMORY_PROPERTY_HOST_COHERENT_BIT,
  VK_MEMORY_PROPERTY_HOST_VISIBLE_BIT,
  VK_SHARING_MODE_EXCLUSIVE
} from "nvk";
import { submit } from "../vulkan";

function getMemoryRequirements(device: VkDevice, buffer: VkBuffer) {
  const memoryRequirements = new VkMemoryRequirements();
  vkGetBufferMemoryRequirements(device, buffer, memoryRequirements);
  return memoryRequirements;
}

function getMemoryTypeIndex(physicalDevice: VkPhysicalDevice, typeFilter: number) {
  // eslint-disable-next-line no-bitwise
  const propertyFlag = VK_MEMORY_PROPERTY_HOST_VISIBLE_BIT | VK_MEMORY_PROPERTY_HOST_COHERENT_BIT;
  const memoryProperties = new VkPhysicalDeviceMemoryProperties();
  vkGetPhysicalDeviceMemoryProperties(physicalDevice, memoryProperties);
  for(let i=0; i<memoryProperties.memoryTypeCount; i+=1) {
    // eslint-disable-next-line no-bitwise
    if((typeFilter & (1 << i)) && ((memoryProperties.memoryTypes?.[i].propertyFlags ?? 0) & propertyFlag) === propertyFlag) {
      return i;
    }
  }
  return -1;
}

function allocateMemory(device: VkDevice, physicalDevice: VkPhysicalDevice, buffer: VkBuffer, bufferMemory: VkDeviceMemory) {
  const memoryRequirements = getMemoryRequirements(device, buffer);

  const memAllocInfo = new VkMemoryAllocateInfo({
    sType: VkStructureType.VK_STRUCTURE_TYPE_MEMORY_ALLOCATE_INFO,
    allocationSize: memoryRequirements.size,
    memoryTypeIndex: getMemoryTypeIndex(physicalDevice, memoryRequirements.memoryTypeBits)
  });
  submit(vkAllocateMemory, device, memAllocInfo, null, bufferMemory);
}

export function createVertexBuffer(device: VkDevice, physicalDevice: VkPhysicalDevice, vertices: Float32Array) {
  const buffer = new VkBuffer();
  const bufferMemory = new VkDeviceMemory();
  const bufferInfo = new VkBufferCreateInfo({
    sType: VkStructureType.VK_STRUCTURE_TYPE_BUFFER_CREATE_INFO,
    size: vertices.byteLength,
    usage: VK_BUFFER_USAGE_VERTEX_BUFFER_BIT,
    sharingMode: VK_SHARING_MODE_EXCLUSIVE,
    queueFamilyIndexCount: 0,
    pQueueFamilyIndices: null
  });
  submit(vkCreateBuffer, device, bufferInfo, null, buffer);

  allocateMemory(device, physicalDevice, buffer, bufferMemory);
  submit(vkBindBufferMemory, device, buffer, bufferMemory, 0n);

  const dataPtr = { $: 0n };
  submit(vkMapMemory, device, bufferMemory, 0n, bufferInfo.size, 0, dataPtr);

  const verticiesBuffer = ArrayBuffer.fromAddress(dataPtr.$, bufferInfo.size);
  const verticiesView = new Float32Array(verticiesBuffer);
  for(let i = 0; i<vertices.length; i+=1) {
    verticiesView[i] = vertices[i];
  }
  vkUnmapMemory(device, bufferMemory);
  return buffer;
}
