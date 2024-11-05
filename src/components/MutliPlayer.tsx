import { useEffect, useReducer, FC } from "react";
import "pixi.js";
import { Stage } from "@pixi/react";
import { useWindowSize } from "@react-hook/window-size";
import { io, Socket } from "socket.io-client";

import { PlayerCommand, GameEvent } from "../protocol";
import { gameReducer, emptyGame, MapSizeX } from "../engine/game";
import { playerUIReducer, initialPlayerUIState } from "../playerUI";
import { loadMultiPlayer } from "../mapLoader";

import { useGameParams } from "./hooks";
import Space from "./Space";
import Minimap from "./Minimap";
import Time from "./Time";

const Multiplayer: FC = () => {
  const { gameId, playerId } = useGameParams();
  const [width, height] = useWindowSize();
  const [game, dispatchGame] = useReducer(gameReducer, emptyGame);
  const [ui, dispatchUi] = useReducer(playerUIReducer, {
    ...initialPlayerUIState,
    viewport: { width, height },
    zoom: 1 / (MapSizeX / width),
  });

  useEffect(() => {
    const socket: Socket<PlayerCommand, GameEvent> = io("ws://localhost:3000/");
    socket.connect();
    socket.on("action", (action) => {
      console.log("receive and dispatch action", action);
      dispatchGame(action);
    });
    loadMultiPlayer("1").then((game) => {
      console.log(game);
      socket.emit("action", { type: "SELECT_MAP", game });
    });
    return () => {
      socket.close();
    };
  }, [gameId, playerId]);

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

export default Multiplayer;
