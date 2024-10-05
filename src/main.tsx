import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import init from "./vector.wasm?init";

import { WASI } from "@bjorn3/browser_wasi_shim";

const args = ["bin", "arg1", "arg2"];
const env = ["FOO=bar"];
const wasi = new WASI(args, env, []);

init({ wasi_snapshot_preview1: wasi.wasiImport }).then((instance) => {
  console.log(instance.exports);
});

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
