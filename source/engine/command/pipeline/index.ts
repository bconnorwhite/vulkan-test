import {
  vkCreateGraphicsPipelines,
  vkCreatePipelineLayout,
  VkDevice,
  VkGraphicsPipelineCreateInfo,
  VkOffset2D,
  VkPipeline,
  VkPipelineColorBlendAttachmentState,
  VkPipelineColorBlendStateCreateInfo,
  VkPipelineInputAssemblyStateCreateInfo,
  VkPipelineLayout,
  VkPipelineLayoutCreateInfo,
  VkPipelineMultisampleStateCreateInfo,
  VkPipelineRasterizationStateCreateInfo,
  VkPipelineVertexInputStateCreateInfo,
  VkPipelineViewportStateCreateInfo,
  VkRect2D,
  VkRenderPass,
  VkStructureType,
  VkVertexInputAttributeDescription,
  VkVertexInputBindingDescription,
  VkViewport,
  VK_BLEND_FACTOR_ONE,
  VK_BLEND_FACTOR_ONE_MINUS_SRC_ALPHA,
  VK_BLEND_FACTOR_SRC_ALPHA,
  VK_BLEND_FACTOR_ZERO,
  VK_BLEND_OP_ADD,
  VK_COLOR_COMPONENT_A_BIT,
  VK_COLOR_COMPONENT_B_BIT,
  VK_COLOR_COMPONENT_G_BIT,
  VK_COLOR_COMPONENT_R_BIT,
  VK_CULL_MODE_BACK_BIT,
  VK_FORMAT_R32G32_SFLOAT,
  VK_FRONT_FACE_CLOCKWISE,
  VK_LOGIC_OP_NO_OP,
  VK_POLYGON_MODE_FILL,
  VK_PRIMITIVE_TOPOLOGY_TRIANGLE_LIST,
  VK_SAMPLE_COUNT_1_BIT,
  VK_VERTEX_INPUT_RATE_VERTEX,
  VulkanWindow
} from "nvk";
import { getShaderStages } from "./shaders";
import { getExtent2D } from "../../window";
import { submit } from "../../vulkan";

function getVertexInputInfo(vertices: Float32Array) {
  const posVertexBindingDescr = new VkVertexInputBindingDescription({
    binding: 0,
    stride: 2 * vertices.BYTES_PER_ELEMENT,
    inputRate: VK_VERTEX_INPUT_RATE_VERTEX
  });
  const posVertexAttrDescr = new VkVertexInputAttributeDescription({
    location: 0,
    binding: 0,
    format: VK_FORMAT_R32G32_SFLOAT,
    offset: 0
  });
  const vertexInputInfo = new VkPipelineVertexInputStateCreateInfo({
    sType: VkStructureType.VK_STRUCTURE_TYPE_PIPELINE_VERTEX_INPUT_STATE_CREATE_INFO,
    vertexBindingDescriptionCount: 1,
    pVertexBindingDescriptions: [posVertexBindingDescr],
    vertexAttributeDescriptionCount: 1,
    pVertexAttributeDescriptions: [posVertexAttrDescr]
  });
  return vertexInputInfo;
}

function getViewportStateInfo(window: VulkanWindow) {
  const viewport = new VkViewport({
    x: 0,
    y: 0,
    width: window.width,
    height: window.height,
    minDepth: 0.0,
    maxDepth: 1.0
  });
  const scissor = new VkRect2D({
    offset: new VkOffset2D({
      x: 0,
      y: 0
    }),
    extent: getExtent2D(window)
  });
  return new VkPipelineViewportStateCreateInfo({
    sType: VkStructureType.VK_STRUCTURE_TYPE_PIPELINE_VIEWPORT_STATE_CREATE_INFO,
    viewportCount: 1,
    pViewports: [viewport],
    scissorCount: 1,
    pScissors: [scissor]
  });
}

function getPipelineLayout(device: VkDevice) {
  const pipelineLayout = new VkPipelineLayout();
  const pipelineLayoutInfo = new VkPipelineLayoutCreateInfo({
    sType: VkStructureType.VK_STRUCTURE_TYPE_PIPELINE_LAYOUT_CREATE_INFO,
    setLayoutCount: 0,
    pushConstantRangeCount: 0
  });
  submit(vkCreatePipelineLayout, device, pipelineLayoutInfo, null, pipelineLayout);
  return pipelineLayout;
}

export function createPipeline(window: VulkanWindow, device: VkDevice, renderPass: VkRenderPass, vertices: Float32Array) {
  const pipeline = new VkPipeline();
  const viewportStateInfo = getViewportStateInfo(window);
  const shaderStages = getShaderStages(device);
  const pipelineLayout = getPipelineLayout(device);
  const vertexInputInfo = getVertexInputInfo(vertices);
  const graphicsPipelineInfo = new VkGraphicsPipelineCreateInfo({
    sType: VkStructureType.VK_STRUCTURE_TYPE_GRAPHICS_PIPELINE_CREATE_INFO,
    stageCount: shaderStages.length,
    pStages: shaderStages,
    pVertexInputState: vertexInputInfo,
    pInputAssemblyState: new VkPipelineInputAssemblyStateCreateInfo({
      sType: VkStructureType.VK_STRUCTURE_TYPE_PIPELINE_INPUT_ASSEMBLY_STATE_CREATE_INFO,
      topology: VK_PRIMITIVE_TOPOLOGY_TRIANGLE_LIST,
      primitiveRestartEnable: false
    }),
    pTessellationState: null,
    pViewportState: viewportStateInfo,
    pRasterizationState: new VkPipelineRasterizationStateCreateInfo({
      sType: VkStructureType.VK_STRUCTURE_TYPE_PIPELINE_RASTERIZATION_STATE_CREATE_INFO,
      depthClampEnable: false,
      rasterizerDiscardEnable: false,
      polygonMode: VK_POLYGON_MODE_FILL,
      cullMode: VK_CULL_MODE_BACK_BIT,
      frontFace: VK_FRONT_FACE_CLOCKWISE,
      depthBiasEnable: false,
      depthBiasConstantFactor: 0.0,
      depthBiasClamp: 0.0,
      depthBiasSlopeFactor: 0.0,
      lineWidth: 1.0
    }),
    pMultisampleState: new VkPipelineMultisampleStateCreateInfo({
      sType: VkStructureType.VK_STRUCTURE_TYPE_PIPELINE_MULTISAMPLE_STATE_CREATE_INFO,
      rasterizationSamples: VK_SAMPLE_COUNT_1_BIT,
      minSampleShading: 1.0,
      pSampleMask: null,
      alphaToCoverageEnable: false,
      alphaToOneEnable: false
    }),
    pDepthStencilState: null,
    pColorBlendState: new VkPipelineColorBlendStateCreateInfo({
      sType: VkStructureType.VK_STRUCTURE_TYPE_PIPELINE_COLOR_BLEND_STATE_CREATE_INFO,
      logicOpEnable: false,
      logicOp: VK_LOGIC_OP_NO_OP,
      attachmentCount: 1,
      pAttachments: [
        new VkPipelineColorBlendAttachmentState({
          blendEnable: true,
          srcColorBlendFactor: VK_BLEND_FACTOR_SRC_ALPHA,
          dstColorBlendFactor: VK_BLEND_FACTOR_ONE_MINUS_SRC_ALPHA,
          colorBlendOp: VK_BLEND_OP_ADD,
          srcAlphaBlendFactor: VK_BLEND_FACTOR_ONE,
          dstAlphaBlendFactor: VK_BLEND_FACTOR_ZERO,
          alphaBlendOp: VK_BLEND_OP_ADD,
          // eslint-disable-next-line no-bitwise
          colorWriteMask: (VK_COLOR_COMPONENT_R_BIT | VK_COLOR_COMPONENT_G_BIT | VK_COLOR_COMPONENT_B_BIT | VK_COLOR_COMPONENT_A_BIT)
        })
      ],
      blendConstants: [0.0, 0.0, 0.0, 0.0]
    }),
    pDynamicState: null,
    layout: pipelineLayout,
    renderPass,
    subpass: 0,
    basePipelineHandle: null,
    basePipelineIndex: -1
  });
  submit(vkCreateGraphicsPipelines, device, null, 1, [graphicsPipelineInfo], null, [pipeline]);
  return pipeline;
}
