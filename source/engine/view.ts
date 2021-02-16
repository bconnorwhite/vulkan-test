import {
  VulkanWindowInitializer,
  VulkanWindow,
  VkExtent2D,
  VkPipelineViewportStateCreateInfo,
  VkStructureType,
  VkViewport,
  VkRect2D,
  VkOffset2D
} from "nvk";

export type View =
  | VulkanWindow
  | Pick<
      VulkanWindow,
        | "width"
        | "height"
        | "getRequiredInstanceExtensions"
      > & {
        pollEvents: undefined;
        shouldClose: undefined;
        createSurface: undefined;
        isVirtual: true;
      };

export function createWindow(params: VulkanWindowInitializer) {
  return new VulkanWindow(params);
}

export function createView(params: VulkanWindowInitializer): View {
  return {
    isVirtual: true,
    width: params.width,
    height: params.height,
    getRequiredInstanceExtensions: () => [],
    pollEvents: undefined,
    shouldClose: undefined,
    createSurface: undefined
  }
}

export function getExtent2D({ width, height }: View) {
  return new VkExtent2D({ width, height });
}

export function getViewportStateInfo(view: View) {
  return new VkPipelineViewportStateCreateInfo({
    sType: VkStructureType.VK_STRUCTURE_TYPE_PIPELINE_VIEWPORT_STATE_CREATE_INFO,
    viewportCount: 1,
    pViewports: [
      new VkViewport({
        x: 0,
        y: 0,
        width: view.width,
        height: view.height,
        minDepth: 0.0,
        maxDepth: 1.0
      })
    ],
    scissorCount: 1,
    pScissors: [
      new VkRect2D({
        offset: new VkOffset2D({
          x: 0,
          y: 0
        }),
        extent: getExtent2D(view)
      })
    ]
  });
}
