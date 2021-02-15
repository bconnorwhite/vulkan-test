interface ArrayBufferConstructor {
  fromAddress($: bigint, size: number | bigint): ArrayBuffer;
  readonly prototype: ArrayBuffer;
  new(byteLength: number): ArrayBuffer;
  isView(arg: any): arg is ArrayBufferView;
}
declare const ArrayBuffer: ArrayBufferConstructor;

declare module "nvk" {
  export * from "nvk/generated/1.1.126/darwin";

  /**
   * Bind vertex buffers to a command buffer
   * @param commandBuffer is the command buffer into which the command is recorded.
   * @param firstBinding is the index of the first vertex input binding whose state is updated by the command.
   * @param bindingCount is the number of vertex input bindings whose state is updated by the command.
   * @param pBuffers is an array of buffer handles.
   * @param pOffsets is an array of buffer offsets.
   */
  export function vkCmdBindVertexBuffers(
    commandBuffer: VkCommandBuffer | null,
    firstBinding: number,
    bindingCount: number,
    pBuffers: VkBuffer[] | null,
    pOffsets: BigUint64Array | null
  ): void;

}
