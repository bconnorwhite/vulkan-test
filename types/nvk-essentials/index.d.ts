declare module "nvk-essentials" {
  export type Extensions =
    | "vert"
    | "tesc"
    | "tese"
    | "geom"
    | "frag"
    | "comp"
    | "mesh"
    | "task"
    | "rgen"
    | "rint"
    | "rahit"
    | "rchit"
    | "rmiss"
    | "rcall"
    | "glsl"
    | "hlsl";
  export type Options = {
    source: Buffer;
    extension: Extension;
    includeDirectories?: string[];
  };
  export type SPIRV = {
    output: Uint8Array | null;
    error: any;
  }
  declare const GLSL: {
    version: () => string;
    toSPIRV: (opts: Options) => Promise<SPIRV>;
    toSPIRVSync: (opts: Options) => SPIRV;
  }
  export {
    GLSL
  }
}
