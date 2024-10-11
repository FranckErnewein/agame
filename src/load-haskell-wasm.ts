import wasm from "./vector.wasm?init";

import { WASI } from "@bjorn3/browser_wasi_shim";

const wasi = new WASI([], [], []);

wasm({ wasi_snapshot_preview1: wasi.wasiImport }).then((instance) => {
  console.log(instance);
});
