import { readFileSync } from "fs";
import {
  vkCreateShaderModule,
  VkDevice,
  VkPipelineShaderStageCreateInfo,
  VkShaderModule,
  VkShaderModuleCreateInfo,
  VkShaderStageFlagBits,
  VkStructureType,
  VK_SHADER_STAGE_FRAGMENT_BIT,
  VK_SHADER_STAGE_VERTEX_BIT
} from "nvk";
import { GLSL } from "nvk-essentials";
import { submit } from "../vulkan";

function createShaderModule(device: VkDevice, shaderSrc: Uint8Array, shaderModule: VkShaderModule) {
  const shaderModuleInfo = new VkShaderModuleCreateInfo({
    sType: VkStructureType.VK_STRUCTURE_TYPE_SHADER_MODULE_CREATE_INFO,
    pCode: shaderSrc,
    codeSize: shaderSrc.byteLength
  });
  submit(vkCreateShaderModule, device, shaderModuleInfo, null, shaderModule)
  return shaderModule;
}

function getVertShaderModule(device: VkDevice) {
  const vertSrc = GLSL.toSPIRVSync({
    source: readFileSync("./shaders/triangle.vert"),
    extension: "vert"
  }).output ?? new Uint8Array();
  return createShaderModule(device, vertSrc, new VkShaderModule());
}

function getFragShaderModule(device: VkDevice) {
  const fragSrc = GLSL.toSPIRVSync({
    source: readFileSync("./shaders/triangle.frag"),
    extension: "frag"
  }).output ?? new Uint8Array();
  return createShaderModule(device, fragSrc, new VkShaderModule());
}

function getShaderStageInfo(module: VkShaderModule, stage: VkShaderStageFlagBits) {
  return new VkPipelineShaderStageCreateInfo({
    sType: VkStructureType.VK_STRUCTURE_TYPE_PIPELINE_SHADER_STAGE_CREATE_INFO,
    stage,
    module,
    pName: "main",
    pSpecializationInfo: null
  });
}

export function getShaderStages(device: VkDevice) {
  const shaderStageInfoVert = getShaderStageInfo(getVertShaderModule(device), VK_SHADER_STAGE_VERTEX_BIT);
  const shaderStageInfoFrag = getShaderStageInfo(getFragShaderModule(device), VK_SHADER_STAGE_FRAGMENT_BIT);
  return [shaderStageInfoVert, shaderStageInfoFrag];
}
