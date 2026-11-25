import * as THREE from 'three';
import { describe, expect, it } from 'vitest';
import { loadUsd, UsdImportError } from '../src/index.js';
import { allSamples, sample } from './files.js';

describe('USD', () => {
  it('reads text and binary crate layers alike', async () => {
    const text = await loadUsd(sample('convertingLayerFormats_Sphere.usda'));
    expect(text.encoding).toBe('usda');
    expect(text.stats).toMatchObject({ meshes: 1, triangles: 960 });
    const crate = await loadUsd(sample('animatedTop_top.geom.usd'));
    expect(crate.encoding).toBe('usdc');
    expect(crate.stats.meshes).toBe(1);
  });

  it('reads shading with a texture beside the layer', async () => {
    const r = await loadUsd(allSamples(), { main: 'simpleShading_simpleShading.usda' });
    expect(r.missing).toEqual([]);
    expect(r.stats.textures).toBe(1);
    expect(r.layers.length).toBeGreaterThan(0);
  });

  it('reads binary assets from Maya', async () => {
    for (const name of ['endToEnd_assets_Ball_Ball.maya.usd', 'endToEnd_assets_Table_Table.maya.usd']) {
      expect((await loadUsd(sample(name))).stats.meshes, name).toBe(1);
    }
  });

  it('reads a stage of several prims', async () => {
    const r = await loadUsd(sample('usdSemanticsExamples_bookshelf.usda'));
    expect(r.stats.meshes).toBe(6);
    expect(r.group.getObjectByProperty('type', 'Mesh')).toBeInstanceOf(THREE.Mesh);
  });

  it('warns about stages with nothing to draw', async () => {
    const r = await loadUsd(sample('usdGeomExamples_basisCurves.usda'));
    expect(r.warnings.some((w) => w.includes('nothing'))).toBe(true);
  });

  it('refuses files that are not USD', async () => {
    await expect(loadUsd({ name: 'a.usda', data: 'hello' })).rejects.toThrow(UsdImportError);
  });
});
