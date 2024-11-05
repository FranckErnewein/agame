import { useEffect, useReducer, FC } from "react";
import "pixi.js";
import { Stage } from "@pixi/react";
import { useWindowSize } from "@react-hook/window-size";
import { useParams } from "react-router-dom";
import { io } from "socket.io-client";

import { gameReducer, emptyGame, MapSizeX } from "../game";
import { playerUIReducer, initialPlayerUIState } from "../playerUI";

import Space from "./Space";
import Minimap from "./Minimap";
import Time from "./Time";

const Multiplayer: FC = () => {
  const { gameId, playerId } = useParams<{
    gameId: string;
    playerId: string;
  }>();
  const [width, height] = useWindowSize();
  const [game, dispatchGame] = useReducer(gameReducer, emptyGame);
  const [ui, dispatchUi] = useReducer(playerUIReducer, {
    ...initialPlayerUIState,
    viewport: { width, height },
    zoom: 1 / (MapSizeX / width),
  });

  useEffect(() => {
    const socket = io("ws://localhost:3000/");
    socket.connect();
    socket.on("message", (m) => console.log(m));
    console.log(socket);
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
    <Stage options={{ background: 0x000000 }} width={width} height={height}>
      <Space {...{ game, dispatchGame, ui, dispatchUi }} />
      <Minimap ui={ui} stageSize={[width, height]} {...{ game }} />
      <Time time={game.time} />
    </Stage>
  );
};

export default Multiplayer;
