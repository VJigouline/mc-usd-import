// three.js ships its USD parsers without type declarations.

declare module 'three/examples/jsm/loaders/usd/USDAParser.js' {
  export class USDAParser {
    parseData(text: string): unknown;
  }
}

declare module 'three/examples/jsm/loaders/usd/USDCParser.js' {
  export class USDCParser {
    parseData(buffer: ArrayBuffer): unknown;
  }
}

declare module 'three/examples/jsm/loaders/usd/USDComposer.js' {
  import type { Group, LoadingManager } from 'three';
  export class USDComposer {
    constructor(manager?: LoadingManager);
    texturePromises: Promise<unknown>[];
    compose(data: unknown, assets?: Record<string, unknown>, variantSelections?: Record<string, string>, basePath?: string): Group;
  }
}
