import { useEffect, useReducer, FC } from "react";
import { Stage } from "@pixi/react";
import { useWindowSize } from "@react-hook/window-size";
import { useParams } from "react-router-dom";

import * as time from "../engine/time";
import { gameReducer, emptyGame, MapSizeX } from "../engine/game";
import { loadPuzzle } from "../map/loader";
import { playerUIReducer, initialPlayerUIState } from "../playerUI";

import Space from "./Space";
import Minimap from "./Minimap";
import Time from "./Time";

const Puzzle: FC = () => {
  const { puzzleId } = useParams<{ puzzleId: string }>();
  const [width, height] = useWindowSize();
  const [game, dispatchGame] = useReducer(gameReducer, emptyGame);
  const [ui, dispatchUi] = useReducer(playerUIReducer, {
    ...initialPlayerUIState,
    viewport: { width, height },
    zoom: 1 / (MapSizeX / width),
  });

  useEffect(() => {
    if (puzzleId) {
      let interval: ReturnType<typeof setInterval> | undefined;
      loadPuzzle(puzzleId).then((game) => {
        dispatchGame({ type: "SELECT_MAP", game });
        interval = setInterval(() => {
          dispatchGame({ type: "TIME_GONE", time: time.month });
        }, 16);
      });
      return () => clearInterval(interval);
    }
  }, [puzzleId]);

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
    <Stage options={{ background: 0x000000 }} width={width} height={height}>
      <Space {...{ game, dispatchGame, ui, dispatchUi }} />
      <Minimap ui={ui} stageSize={[width, height]} {...{ game }} />
      <Time time={game.time} />
    </Stage>
  );
};

export default Puzzle;
