import { useState, FC, Dispatch } from "react";
import { compose, flow, times } from "lodash/fp";
import { Sprite, Container } from "@pixi/react";
import { FederatedPointerEvent } from "pixi.js";

import * as time from "../time";
import { sub, scale, revert, eq, Vec2 } from "../vector";
import { move } from "../position";
import { bounceOnPlanets, applyGravity, Ship, GameAction, Game } from "../game";
import { PlayerUI } from "../playerUI";

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
  const velocity = start && delta ? scale(1 / time.year, delta) : null;
  // const projections: Ship[] = times((x:number) => )(10)
  const stepTimer = time.month;
  const nextShip =
    game && velocity
      ? (ship: Ship): Ship =>
          flow([
            move(stepTimer),
            applyGravity(stepTimer)([...game.planets, ...game.suns]),
            bounceOnPlanets(game.planets),
          ])(ship)
      : null;

  let sp: Ship | null = null;
  const projections: Ship[] = [];
  times((i) => {
    sp = nextShip && velocity ? nextShip(sp || { ...ship, velocity }) : null;
    if (sp && i % 5 === 0) projections.push(sp);
  })(200);

  const unproject = scale(1 / ui.zoom);
  const begin = compose(setStart, unproject, pixiEventToVec2);
  const end = () => {
    if (velocity && game && dispatchGame)
      dispatchGame({
        type: "MOVE_SHIP",
        player: game.players[0],
        ship: ship,
        velocity: velocity,
      });
    setStart(null);
    setDelta(null);
  };

  return (
    <>
      <Container
        scale={eq(ship.velocity, [0, 0]) ? 0.95 : 1}
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
      {projections.map((projection: Ship, i) => {
        return (
          <Container
            key={i}
            alpha={0.5 - (i * 0.4) / projections.length}
            position={projection.position}
            scale={0.4}
          >
            <Sprite width={size} height={size} anchor={0.5} image="/ship.png" />
          </Container>
        );
      })}
    </>
  );
};

export default ShipComponent;
