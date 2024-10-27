import { useEffect, useReducer } from "react";
import "pixi.js";
import { Stage } from "@pixi/react";
import { useWindowSize } from "@react-hook/window-size";

import { gameReducer, iniatialGameState, MapSizeX } from "./game";
import { playerUIReducer, initialPlayerUIState } from "./playerUI";
import Space from "./components/Space";
import Minimap from "./components/Minimap";

function App() {
  const [width, height] = useWindowSize();
  const [game, dispatchGame] = useReducer(gameReducer, iniatialGameState);
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
      <Space {...{ game, dispatchGame, ui, dispatchUi }} />
      <Minimap {...{ game }} />
    </Stage>
  );
}

export default App;
