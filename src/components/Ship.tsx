import { FC } from "react";
import { Sprite, Container } from "@pixi/react";
import { Ship } from "../game";
import { toPixiPosition } from "../display";

export interface ShipComponentProps {
  ship: Ship;
}

const ShipComponent: FC<ShipComponentProps> = ({ ship }) => {
  return (
    <Container
      alpha={1}
      position={toPixiPosition(ship)}
      rotation={Math.atan2(ship.velocity.y, ship.velocity.x)}
    >
      <Sprite width={30} height={30} anchor={0.5} image="/ship.png" />
    </Container>
  );
};

export default ShipComponent;
