import { useState, FC, Dispatch } from "react";
import { compose } from "lodash/fp";
import { Sprite, Container } from "@pixi/react";
import { FederatedPointerEvent } from "pixi.js";

import { sub, scale, revert, Vec2 } from "../vector";
import { Ship, GameAction, Game } from "../game";
import { metersToPx, orientation, pxPosition } from "../display";

import Line from "./Line";

export interface ShipComponentProps {
  ship: Ship;
  game?: Game;
  dispatchGame?: Dispatch<GameAction>;
}

const pixiEventToVec2 = (e: FederatedPointerEvent) => [e.global.x, e.global.y];

const ShipComponent: FC<ShipComponentProps> = ({
  ship,
  dispatchGame,
  game,
}) => {
  const [start, setStart] = useState<null | Vec2>(null);
  const [delta, setDelta] = useState<null | Vec2>(null);
  const size = metersToPx(ship.radius * 2);
  const begin = compose(setStart, pixiEventToVec2);
  const end = () => {
    if (delta && game && dispatchGame)
      dispatchGame({
        type: "MOVE_SHIP",
        player: game.players[0],
        ship: ship,
        velocity: scale(4, delta),
      });
    setStart(null);
  };

  return (
    <>
      <Container
        alpha={1}
        rotation={orientation(ship)}
        position={pxPosition(ship)}
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
                pixiEventToVec2
              ),
            }
          : {})}
      >
        <Sprite width={size} height={size} anchor={0.5} image="/ship.png" />
      </Container>
      {start && delta && (
        <Container position={pxPosition(ship)}>
          <Line to={delta} alpha={0.6} />
        </Container>
      )}
    </>
  );
};

export default ShipComponent;
