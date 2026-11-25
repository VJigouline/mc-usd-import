# API

## `loadUsd(input, options?)`

Reads `.usd`, `.usda` or `.usdc`, with the layers and textures it refers to and returns a promise of a `UsdLoadResult`.

`input` is the file's contents (`ArrayBuffer`, `Uint8Array` or string), a browser `File`, `{ name, data }`, or an iterable of files for a model in several files. Zip archives among them are opened.

It throws `UsdImportError` for input that isn't USD.

### Options

| Option | Default | Meaning |
| --- | --- | --- |
| `main` | the first USD layer | The root layer to open, if several are given. |
| `variants` | {} | Variant selections by variant set name. |

### `UsdLoadResult`

| Field | Type | Meaning |
| --- | --- | --- |
| `group` | `THREE.Group` | The model. |
| `rootLayer` | `string` | The root layer's name. |
| `encoding` | `'usda' \| 'usdc'` | The root layer's encoding. |
| `layers` | `string[]` | The other layers given. |
| `missing` | `string[]` | Files the stage refers to that were not given. |
| `warnings` | `string[]` | Problems that didn't stop the import. |
| `stats` | object | Counts of meshes, triangles and the like. |

See the package's `index.d.ts` for every exported type and helper.
