import { FC, Dispatch } from "react";
import { Sprite, Container } from "@pixi/react";

import { Planet, GameAction, Game } from "../game";
import { PlayerUI, PlayerUIAction } from "../playerUI";
import { scale } from "../vector";

export interface PlanetComponentProps {
  planet: Planet;
  ui: PlayerUI;
  game: Game;
  dispatchUi: Dispatch<PlayerUIAction>;
  dispatchGame: Dispatch<GameAction>;
}

const PlanetComponent: FC<PlanetComponentProps> = ({
  planet,
  ui: { zoom },
}) => {
  const project = scale(zoom);
  const size = planet.radius * 2 * zoom;
  return (
    <Container position={project(planet.position)}>
      <Sprite
        width={size}
        height={size}
        anchor={0.5}
        image="/planet.png"
        alpha={0.7}
      />
    </Container>
  );
};

export default PlanetComponent;
