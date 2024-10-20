import { useState, FC, Dispatch } from "react";
import { compose } from "lodash/fp";
import { Sprite, Container } from "@pixi/react";
import { FederatedPointerEvent } from "pixi.js";

import { sub, scale, revert, Vec2 } from "../vector";
import { Ship, GameAction, Game } from "../game";
import { PlayerUI } from "../playerUI";
import { angle } from "../vector";

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
  ui: { zoom },
  game,
}) => {
  const [start, setStart] = useState<null | Vec2>(null);
  const [delta, setDelta] = useState<null | Vec2>(null);
  const project = scale(zoom);
  const size = ship.radius * 2 * zoom;
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
        rotation={angle(ship.velocity)}
        position={project(ship.position)}
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
        <Container position={project(ship.position)}>
          <Line to={delta} alpha={0.6} />
        </Container>
      )}
    </>
  );
};

export default ShipComponent;
