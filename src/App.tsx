import "pixi.js";
import { Stage } from "@pixi/react";
import { MapSizeX, MapSizeY } from "./game";
import { metersToPx } from "./display";
import Space from "./components/Space";

function App() {
  return (
    <Stage
      options={{ background: 0x000000 }}
      width={metersToPx(MapSizeX)}
      height={metersToPx(MapSizeY)}
    >
      <Space />
    </Stage>
  );
}

export default App;
