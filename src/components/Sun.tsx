import { FC } from "react";
import { Sprite, Container } from "@pixi/react";

import { Sun } from "../game";

export interface SunComponentProps {
  sun: Sun;
}

const SunComponent: FC<SunComponentProps> = ({ sun }) => {
  const size = sun.radius * 2;
  return (
    <Container scale={1.4} position={sun.position}>
      <Sprite
        width={size}
        height={size}
        anchor={0.5}
        image="/sun.png"
        alpha={0.7}
      />
    </Container>
  );
};

export default SunComponent;
