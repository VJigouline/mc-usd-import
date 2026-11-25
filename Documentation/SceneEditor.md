# Using it in SceneEditor

[SceneEditor](https://github.com/VJigouline/SceneEditor) opens `.usd`, `.usda` and `.usdc` files, with their layers and textures with mc-usd-import. Drop the root layer with the layers and textures it uses, or their folder, or a zip of them. A `.usdz` package is opened with [mc-usdz-import](https://github.com/VJigouline/mc-usdz-import).

The model is added to the scene, named after its file, and the view is refitted. A file that can't be read gives a **Failure** message, and the scene is unaffected. Warnings go to the browser console.

The model comes in metres with Y up, like the other formats. Its materials can be edited on the Materials tab like any other.
