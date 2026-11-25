# Getting started

## Install

```sh
npm install three github:VJigouline/mc-usd-import
```

## Open a file

`loadUsd` takes the file's contents (`ArrayBuffer`, `Uint8Array` or string), a browser `File`, `{ name, data }`, or an iterable of files for a model in several files. Zip archives among them are opened. It returns a promise of the model.

```ts
import * as THREE from 'three';
import { loadUsd } from 'mc-usd-import';

const input = document.querySelector<HTMLInputElement>('input[type=file]')!;
input.multiple = true;
input.addEventListener('change', async () => {
  const result = await loadUsd(input.files!);
  scene.add(result.group);
  for (const warning of result.warnings) console.warn(warning);
});
```

A model in several files is given as all of them together, or as a zip. Files it refers to (`.usda` or `.usdc`, with the layers and textures it refers to) are found by file name, wherever the model says they are, ignoring case and folders; those not given are listed in `missing`.

## What you get

- **`group`:** a `THREE.Group` holding the model, named after the file.
- **`stats`:** counts of what was read.
- **`warnings`:** anything that couldn't be read or was left out.

The model follows the stage's metersPerUnit and upAxis.

## Options

- **`main`** (default the first USD layer): The root layer to open, if several are given.
- **`variants`** (default {}): Variant selections by variant set name.

See the [API](API.md) for every field of the result.
