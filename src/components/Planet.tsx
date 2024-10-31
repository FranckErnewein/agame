import { FC } from "react";
import { Sprite, Container } from "@pixi/react";

import { Planet } from "../game";

export interface PlanetComponentProps {
  planet: Planet;
}

const PlanetComponent: FC<PlanetComponentProps> = ({ planet }) => {
  const size = planet.radius * 2;
  return (
    <Container position={planet.position}>
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
