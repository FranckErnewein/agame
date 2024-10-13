import { useState, FC, Dispatch } from "react";
import { Sprite, Container } from "@pixi/react";

import { Planet, GameAction, Game } from "../game";
import { add, scale, map } from "../vector";
import { Position } from "../position";
import { PlayerUI, PlayerUIAction } from "../playerUI";
import { metersToPx, pxToMeter, pxPosition } from "../display";
import { createShip } from "../generator";

import Line from "./Line";
import Circle from "./Circle";
import ShipComponent from "./Ship";

export interface PlanetComponentProps {
  planet: Planet;
  ui: PlayerUI;
  game: Game;
  dispatchUi: Dispatch<PlayerUIAction>;
  dispatchGame: Dispatch<GameAction>;
}

const PlanetComponent: FC<PlanetComponentProps> = ({
  planet,
  dispatchUi,
  dispatchGame,
  game,
  ui,
}) => {
  const [cursorPosition, setPosition] = useState<Position>([0, 0]);
  const size = metersToPx(planet.radius * 2);
  const selected = planet === ui.planetSelected;

  // const [x, y] = toPx(cursorPosition);

  return (
    <Container
      eventMode="static"
      onmousemove={(e) => {
        setPosition([e.screen.x, e.screen.y]);
      }}
      onclick={
        !selected
          ? () => dispatchUi({ type: "SELECT_PLANET", planet })
          : () => {
              dispatchGame({
                type: "SEND_SHIP",
                planet,
                player: game.players[0],
                ship: createShip(
                  add(planet.position)(map(pxToMeter)(cursorPosition)),
                  scale(7)(cursorPosition)
                ),
              });
            }
      }
      alpha={selected ? 1 : 0.5}
      position={pxPosition(planet)}
    >
      <Circle radius={size / 2} alpha={1} />
      <Sprite width={size} height={size} anchor={0.5} image="/planet.png" />
      {selected && (
        <Container alpha={0.3}>
          <Line to={cursorPosition} />
          <ShipComponent ship={createShip(map(pxToMeter, cursorPosition))} />
        </Container>
      )}
      {selected && <Circle radius={size} color={0xfffb64} />}
    </Container>
  );
};

export default PlanetComponent;
