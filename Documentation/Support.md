# Formats and support

mc-usd-import reads USD with three.js's USD parsers and composer.

## What is read

- Meshes, with their subsets, normals, texture coordinates and display colours.
- UsdPreviewSurface materials with their textures.
- References, payloads and sublayers to the other layers given; variant sets, with selections you can choose.
- The stage's metersPerUnit and upAxis: the model is scaled to metres and turned Y up.

## Orientation and units

The model follows the stage's metersPerUnit and upAxis.

## Limits

Curves, points, volumes and procedural prims are not drawn; a stage with nothing three.js can draw gets a warning. Textures are PNG, JPEG, AVIF or WebP.
