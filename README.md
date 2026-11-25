# mc-usd-import

A USD importer for [three.js](https://threejs.org/), written in TypeScript. It reads Universal Scene Description stages, text (`.usda`) or binary crate (`.usdc`), with the layers they reference and the textures they use, in metres and Y up. It was made for [SceneEditor](https://github.com/VJigouline/SceneEditor), and works in any three.js application.

```ts
import { loadUsd } from 'mc-usd-import';

const result = await loadUsd(input.files);   // the root layer, its layers and textures
scene.add(result.group);
console.log(result.warnings);       // anything that couldn't be read
```

## What it reads

- Meshes, with their subsets, normals, texture coordinates and display colours.
- UsdPreviewSurface materials with their textures.
- References, payloads and sublayers to the other layers given; variant sets, with selections you can choose.
- The stage's metersPerUnit and upAxis: the model is scaled to metres and turned Y up.

Curves, points, volumes and procedural prims are not drawn; a stage with nothing three.js can draw gets a warning. Textures are PNG, JPEG, AVIF or WebP. See [Formats and support](Documentation/Support.md) for the details.

## Install

The package is not on the npm registry. Install it from GitHub:

```sh
npm install github:VJigouline/mc-usd-import
```

`three` (r160 or later) is a peer dependency. The package builds itself on install.

## Documentation

- [Getting started](Documentation/GettingStarted.md)
- [API](Documentation/API.md)
- [Formats and support](Documentation/Support.md)
- [Using it in SceneEditor](Documentation/SceneEditor.md)

## Development

```sh
npm install
npm test           # unit tests, with Vitest
npm run typecheck
npm run build      # dist/
```

The tests load real USD files, kept in [`tests/samples`](tests/samples/README.md) with their licences. It needs Node.js 22 or later.

## Licence

[MIT](LICENSE)
