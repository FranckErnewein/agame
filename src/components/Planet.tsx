import { useState, FC, Dispatch } from "react";
import { Sprite, Container } from "@pixi/react";

import { Planet, GameAction, Game, planetInfluence } from "../game";
import { Position } from "../position";
import { PlayerUI, PlayerUIAction } from "../playerUI";
import { metersToPx, pxToMeter } from "../display";
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
  const [position, setPosition] = useState<Position>({ x: 0, y: 0 });
  const size = metersToPx(planet.radius * 2);
  const selected = planet === ui.planetSelected;

  const x = metersToPx(planet.position.x);
  const y = metersToPx(planet.position.y);

  return (
    <Container
      eventMode="static"
      onmousemove={(e) => {
        setPosition({ x: e.screen.x - x, y: e.screen.y - y });
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
                  {
                    x: planet.position.x + pxToMeter(position.x),
                    y: planet.position.y + pxToMeter(position.y),
                  },
                  { x: position.x * 7, y: position.y * 7 }
                ),
              });
            }
      }
      alpha={selected ? 1 : 0.5}
      position={[x, y]}
    >
      <Sprite width={size} height={size} anchor={0.5} image="/planet.png" />
      {selected && (
        <Container alpha={0.3}>
          <Line to={position} />
          <ShipComponent
            ship={createShip({
              x: pxToMeter(position.x),
              y: pxToMeter(position.y),
            })}
          />
        </Container>
      )}
      {selected && <Circle radius={planetInfluence} />}
    </Container>
  );
};

export default PlanetComponent;
