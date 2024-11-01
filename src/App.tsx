import { useEffect, useReducer } from "react";
import "pixi.js";
import { Stage } from "@pixi/react";
import { useWindowSize } from "@react-hook/window-size";

import * as time from "./time";
import { gameReducer, iniatialGameState, MapSizeX } from "./game";
import { playerUIReducer, initialPlayerUIState } from "./playerUI";

import Space from "./components/Space";
import Minimap from "./components/Minimap";
import Time from "./components/Time";

function App() {
  const [width, height] = useWindowSize();
  const [game, dispatchGame] = useReducer(gameReducer, iniatialGameState);
  const [ui, dispatchUi] = useReducer(playerUIReducer, {
    ...initialPlayerUIState,
    viewport: { width, height },
    zoom: 1 / (MapSizeX / width),
  });

  useEffect(() => {
    const interval = setInterval(() => {
      dispatchGame({ type: "TIME_GONE", time: time.month });
    }, 8);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    dispatchUi({ type: "RESIZE", width, height });
  }, [width, height]);

  useEffect(() => {
    const listener = (e: WheelEvent) => {
      if (e.deltaX > 0) {
        e.preventDefault();
      }
      dispatchUi({
        type: "ZOOM",
        zoom: ui.zoom * (1 + e.deltaY / 200),
      });
      return false;
    };
    window.addEventListener("wheel", listener, { passive: false });
    return () => window.removeEventListener("wheel", listener);
  }, [ui.zoom]);

  return (
    <Stage
      options={{ background: 0x000000, sharedTicker: true }}
      width={width}
      height={height}
    >
      <Space {...{ game, dispatchGame, ui, dispatchUi }} />
      <Minimap ui={ui} stageSize={[width, height]} {...{ game }} />
      <Time time={game.time} />
    </Stage>
  );
}

export default App;
