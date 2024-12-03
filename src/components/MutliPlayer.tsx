import { useEffect, useReducer, useState, FC } from "react";
import styled from "styled-components";
import { Stage } from "@pixi/react";
import { useParams } from "react-router-dom";
import { useWindowSize } from "@react-hook/window-size";
import { io, Socket } from "socket.io-client";

import { createClientRunner, PlayerCommand, ServerEvent } from "../protocol";
import { emptyGame, MapSizeX, Game, GameAction } from "../engine/game";
import { playerUIReducer, initialPlayerUIState } from "../playerUI";

import Space from "./Space";
import Minimap from "./Minimap";
import Time from "./Time";

const UI = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  padding: 10px;
`;

const Multiplayer: FC = () => {
  const { playerId } = useParams();
  const [game, setGame] = useState<Game>(emptyGame);
  const [dispatchGame, setDispatchGame] = useState<
    (action: GameAction) => void
  >(() => null);
  const [width, height] = useWindowSize();
  const [ui, dispatchUi] = useReducer(playerUIReducer, {
    ...initialPlayerUIState,
    viewport: { width, height },
    zoom: 1 / (MapSizeX / width),
  });

  useEffect(() => {
    const socket: Socket<ServerEvent, PlayerCommand> = io(
      "ws://localhost:3000/"
    );
    socket.connect();
    socket.once("init", (initState) => {
      const onLockStep = createClientRunner(initState, setGame);
      socket.on("lockstep", onLockStep);
      setDispatchGame(() => (action: GameAction) => {
        socket.emit("action", action);
      });
    });
    return () => {
      socket.close();
    };
  }, [playerId]);

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
    <>
      <Stage options={{ background: 0x000000 }} width={width} height={height}>
        <Space {...{ game, dispatchGame, ui, dispatchUi }} />
        <Minimap ui={ui} stageSize={[width, height]} {...{ game }} />
        <Time time={game.time} />
      </Stage>
      <UI>
        <button
          onClick={() => dispatchGame({ type: "PLAYER_READY", playerId: "1" })}
        >
          Ready
        </button>
      </UI>
    </>
  );
};

export default Multiplayer;
