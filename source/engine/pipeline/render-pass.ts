import {
  VkAttachmentDescription,
  VkAttachmentReference,
  vkCreateRenderPass,
  VkDevice,
  VkRenderPass,
  VkRenderPassCreateInfo,
  VkStructureType,
  VkSubpassDependency,
  VkSubpassDescription,
  VK_ACCESS_COLOR_ATTACHMENT_READ_BIT,
  VK_ACCESS_COLOR_ATTACHMENT_WRITE_BIT,
  VK_ATTACHMENT_LOAD_OP_CLEAR,
  VK_ATTACHMENT_LOAD_OP_DONT_CARE,
  VK_ATTACHMENT_STORE_OP_DONT_CARE,
  VK_ATTACHMENT_STORE_OP_STORE,
  VK_FORMAT_B8G8R8A8_UNORM,
  VK_IMAGE_LAYOUT_COLOR_ATTACHMENT_OPTIMAL,
  VK_IMAGE_LAYOUT_PRESENT_SRC_KHR,
  VK_IMAGE_LAYOUT_UNDEFINED,
  VK_PIPELINE_BIND_POINT_GRAPHICS,
  VK_PIPELINE_STAGE_COLOR_ATTACHMENT_OUTPUT_BIT,
  VK_SAMPLE_COUNT_1_BIT,
  VK_SUBPASS_EXTERNAL
} from "nvk";
import { submit } from "../vulkan";

const renderPassInfo = new VkRenderPassCreateInfo({
  sType: VkStructureType.VK_STRUCTURE_TYPE_RENDER_PASS_CREATE_INFO,
  attachmentCount: 1,
  pAttachments: [
    new VkAttachmentDescription({
      flags: 0,
      format: VK_FORMAT_B8G8R8A8_UNORM,
      samples: VK_SAMPLE_COUNT_1_BIT,
      loadOp: VK_ATTACHMENT_LOAD_OP_CLEAR,
      storeOp: VK_ATTACHMENT_STORE_OP_STORE,
      stencilLoadOp: VK_ATTACHMENT_LOAD_OP_DONT_CARE,
      stencilStoreOp: VK_ATTACHMENT_STORE_OP_DONT_CARE,
      initialLayout: VK_IMAGE_LAYOUT_UNDEFINED,
      finalLayout: VK_IMAGE_LAYOUT_PRESENT_SRC_KHR
    })
  ],
  subpassCount: 1,
  pSubpasses: [
    new VkSubpassDescription({
      pipelineBindPoint: VK_PIPELINE_BIND_POINT_GRAPHICS,
      inputAttachmentCount: 0,
      pInputAttachments: null,
      colorAttachmentCount: 1,
      pColorAttachments: [
        new VkAttachmentReference({
          attachment: 0,
          layout: VK_IMAGE_LAYOUT_COLOR_ATTACHMENT_OPTIMAL
        })
      ],
      pResolveAttachments: null,
      pDepthStencilAttachment: null,
      preserveAttachmentCount: 0,
      pPreserveAttachments: null
    })
  ],
  dependencyCount: 1,
  pDependencies: [
    new VkSubpassDependency({
      srcSubpass: VK_SUBPASS_EXTERNAL,
      dstSubpass: 0,
      srcStageMask: VK_PIPELINE_STAGE_COLOR_ATTACHMENT_OUTPUT_BIT,
      dstStageMask: VK_PIPELINE_STAGE_COLOR_ATTACHMENT_OUTPUT_BIT,
      srcAccessMask: 0,
      // eslint-disable-next-line no-bitwise
      dstAccessMask: (VK_ACCESS_COLOR_ATTACHMENT_READ_BIT | VK_ACCESS_COLOR_ATTACHMENT_WRITE_BIT),
      dependencyFlags: 0
    })
  ]
});

export function createRenderPass(device: VkDevice) {
  const renderPass = new VkRenderPass();
  submit(vkCreateRenderPass, device, renderPassInfo, null, renderPass);
  return renderPass;
}
