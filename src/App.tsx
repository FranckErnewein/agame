import { useEffect, useReducer } from "react";
import "pixi.js";
import { Stage } from "@pixi/react";
import { useWindowSize } from "@react-hook/window-size";

import { MapSizeX } from "./game";
import Space from "./components/Space";
import { playerUIReducer, initialPlayerUIState } from "./playerUI";

function App() {
  const [width, height] = useWindowSize();
  const [ui, dispatchUi] = useReducer(playerUIReducer, {
    ...initialPlayerUIState,
    viewport: { width, height },
    zoom: 1 / (MapSizeX / width),
  });

  useEffect(() => {
    dispatchUi({ type: "RESIZE", width, height });
  }, [width, height]);

  useEffect(() => {
    const listener = (e: WheelEvent) =>
      dispatchUi({
        type: "ZOOM",
        zoom: ui.zoom * (1 + e.deltaY / 200),
      });
    window.addEventListener("wheel", listener);
    return () => window.removeEventListener("wheel", listener);
  }, [ui.zoom]);

  return (
    <Stage options={{ background: 0x000000 }} width={width} height={height}>
      <Space ui={ui} dispatchUi={dispatchUi} />
    </Stage>
  );
}

export default App;
