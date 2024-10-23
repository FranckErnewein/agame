import { useState, FC, Dispatch } from "react";
import { compose } from "lodash/fp";
import { Sprite, Container } from "@pixi/react";
import { FederatedPointerEvent } from "pixi.js";

import { year } from "../time";
import { sub, scale, revert, eq, Vec2 } from "../vector";
import { Ship, GameAction, Game } from "../game";
import { PlayerUI } from "../playerUI";

import Line from "./Line";

export interface ShipComponentProps {
  ship: Ship;
  game?: Game;
  dispatchGame?: Dispatch<GameAction>;
  ui: PlayerUI;
}

const pixiEventToVec2 = (e: FederatedPointerEvent) => [e.global.x, e.global.y];

const ShipComponent: FC<ShipComponentProps> = ({
  ship,
  dispatchGame,
  game,
  ui,
}) => {
  const [start, setStart] = useState<null | Vec2>(null);
  const [delta, setDelta] = useState<null | Vec2>(null);
  const size = ship.radius * 2 * 1.4;
  const unproject = scale(1 / ui.zoom);
  const begin = compose(setStart, unproject, pixiEventToVec2);
  const end = () => {
    if (delta && game && dispatchGame)
      dispatchGame({
        type: "MOVE_SHIP",
        player: game.players[0],
        ship: ship,
        velocity: scale(1 / year, delta),
      });
    setStart(null);
    setDelta(null);
  };

  return (
    <>
      <Container
        alpha={eq(ship.velocity, [0, 0]) ? 0.8 : 1}
        position={ship.position}
        eventMode="static"
        onmousedown={begin}
        onmouseup={end}
        onmouseupoutside={end}
        {...(start
          ? {
              onglobalmousemove: compose(
                setDelta,
                revert,
                sub(start),
                unproject,
                pixiEventToVec2
              ),
            }
          : {})}
      >
        <Sprite width={size} height={size} anchor={0.5} image="/ship.png" />
      </Container>
      {start && delta && (
        <Container position={ship.position}>
          <Line to={delta} alpha={0.6} />
        </Container>
      )}
    </>
  );
};

export default ShipComponent;
