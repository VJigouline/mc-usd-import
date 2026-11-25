import * as THREE from 'three';
import { USDAParser } from 'three/examples/jsm/loaders/usd/USDAParser.js';
import { USDCParser } from 'three/examples/jsm/loaders/usd/USDCParser.js';
import { USDComposer } from 'three/examples/jsm/loaders/usd/USDComposer.js';
import { countModel, extensionOf, FileManager, ImportFiles, type ImportInput, type ImportStats } from './common.js';

export { ImportFiles, FileManager, countModel } from './common.js';
export type { ImportInput, ImportFile, ImportData, ImportStats } from './common.js';

export interface UsdOptions {
  /** The root layer to open, if several USD files are given. By default, the first .usd, .usda or .usdc file. */
  main?: string;
  /** Variant selections, such as { shadingVariant: 'red' }, by variant set name. */
  variants?: Record<string, string>;
}

export interface UsdLoadResult {
  /** The stage, in metres and Y up (from the layer's metersPerUnit and upAxis): a group named after the root layer. */
  group: THREE.Group;
  /** The root layer's name. */
  rootLayer: string;
  /** usda (text) or usdc (binary crate), for the root layer. */
  encoding: 'usda' | 'usdc';
  /** USD layers given with the root layer, which references and sublayers can use. */
  layers: string[];
  /** Files the stage refers to that were not given, such as textures. */
  missing: string[];
  warnings: string[];
  stats: ImportStats;
}

export class UsdImportError extends Error {
  override name = 'UsdImportError';
}

const CRATE = [0x50, 0x58, 0x52, 0x2d, 0x55, 0x53, 0x44, 0x43]; // PXR-USDC
export const isCrate = (b: Uint8Array) => b.length >= 8 && CRATE.every((c, i) => b[i] === c);
const IMAGES = ['png', 'jpg', 'jpeg', 'avif', 'webp'];
const LAYERS = ['usd', 'usda', 'usdc'];

/**
 * Reads a USD stage: a root layer (.usd, .usda or .usdc) with the layers it references and the
 * textures it uses, loose or in a zip (a .usdz package also works).
 */
export async function loadUsd(input: ImportInput, options: UsdOptions = {}): Promise<UsdLoadResult> {
  const files = await ImportFiles.from(input, 'stage.usda');
  const main = files.main(LAYERS, options.main) ?? files.files[0];
  if (!main) throw new UsdImportError('There is no USD layer to open');
  const crate = isCrate(main.bytes);
  const text = crate ? '' : files.text(main);
  if (!crate && !/^#usda\s/.test(text)) throw new UsdImportError(`${main.name} is not a USD layer: it starts with neither #usda nor PXR-USDC`);

  const warnings: string[] = [];
  const usda = new USDAParser();
  const usdc = new USDCParser();
  const parse = (bytes: Uint8Array, name: string) => {
    try {
      return isCrate(bytes) ? usdc.parseData(bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength) as ArrayBuffer) : usda.parseData(new TextDecoder().decode(bytes));
    } catch (error) {
      warnings.push(`Layer ${name} could not be read: ${(error as Error).message}`);
      return null;
    }
  };
  // Every layer and image, by its path, for references, sublayers and textures to find.
  const assets: Record<string, unknown> = {};
  const layers: string[] = [];
  for (const f of files.files) {
    const ext = extensionOf(f.name);
    const key = f.name.replace(/\\/g, '/');
    if (IMAGES.includes(ext)) assets[key] = f.bytes;
    else if (LAYERS.includes(ext) || f === main) {
      const data = f === main ? null : parse(f.bytes, f.name);
      if (data) assets[key] = data;
      if (f !== main) layers.push(f.name);
    }
  }
  let rootData: unknown;
  try {
    rootData = crate ? usdc.parseData(main.bytes.buffer.slice(main.bytes.byteOffset, main.bytes.byteOffset + main.bytes.byteLength) as ArrayBuffer) : usda.parseData(text);
  } catch (error) {
    throw new UsdImportError(`${main.name} could not be read: ${(error as Error).message}`);
  }
  assets[main.name.replace(/\\/g, '/')] = rootData;

  const fm = new FileManager(files);
  const composer = new USDComposer(fm.manager);
  const slash = main.name.replace(/\\/g, '/').lastIndexOf('/');
  const basePath = slash >= 0 ? main.name.slice(0, slash) : '';
  let stage: THREE.Group;
  try {
    stage = composer.compose(rootData, assets, options.variants ?? {}, basePath);
  } catch (error) {
    throw new UsdImportError(`${main.name} could not be composed: ${(error as Error).message}`);
  }
  await Promise.allSettled(composer.texturePromises as Promise<unknown>[]);
  await fm.done();
  fm.dispose();
  const missing = [...fm.missing];
  if (missing.length) warnings.push(`Not found: ${missing.join(', ')}`);
  const name = main.name.replace(/\\/g, '/').split('/').pop()!.replace(/\.usd[ac]?$/i, '');
  const group = new THREE.Group();
  group.name = name;
  group.add(stage);
  const stats = countModel(group);
  if (stats.meshes + stats.lines + stats.points === 0) warnings.push('The stage has nothing three.js can draw, such as meshes; curves, volumes and procedural prims are not drawn');
  return { group, rootLayer: main.name, encoding: crate ? 'usdc' : 'usda', layers, missing, warnings, stats };
}
