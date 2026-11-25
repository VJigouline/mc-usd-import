# USD test files

Real USD files that the tests load. They are unchanged copies, taken at commit `ee47c679ab` of OpenUSD.

| Files | What they cover | Source and licence |
| --- | --- | --- |
| `convertingLayerFormats_Sphere.usda` and `.usd`, `traversingStage_HelloWorld.usda`, `authoringVariants_HelloWorld.usda`, `simpleShading_simpleShading.usda` with `USDLogoLrg.png`, `endToEnd_assets_Ball_Ball.maya.usd`, `endToEnd_assets_Table_Table.maya.usd`, `animatedTop_top.geom.usd`, `usdGeomExamples_basisCurves.usda`, `usdSemanticsExamples_bookshelf.usda`, `usdDancingCubesExample_dancingCubes.usda` | Text and crate layers, shading with a texture, variants, curves | Pixar's [OpenUSD](https://github.com/PixarAnimationStudios/OpenUSD) (`extras/usd/tutorials` and `extras/usd/examples`), under its [Tomorrow Open Source Technology License 1.0](https://github.com/PixarAnimationStudios/OpenUSD/blob/release/LICENSE.txt), a modified Apache 2.0 licence. The files were renamed with their folders as prefixes. |

These files keep their own licences. They are test data only, and are not part of the npm package, which includes only `dist`, `Documentation`, `README.md` and `LICENSE`.
