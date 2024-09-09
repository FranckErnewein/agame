import { FC } from "react";
import { Sprite, Container } from "@pixi/react";
import { Ship } from "../game";
import { toPixiPosition, metersToPx } from "../display";

export interface ShipComponentProps {
  ship: Ship;
}

const ShipComponent: FC<ShipComponentProps> = ({ ship }) => {
  const size = metersToPx(ship.radius * 2);
  return (
    <Container
      alpha={1}
      position={toPixiPosition(ship)}
      rotation={Math.atan2(ship.velocity.y, ship.velocity.x)}
    >
      <Sprite width={size} height={size} anchor={0.5} image="/ship.png" />
    </Container>
  );
};

export default ShipComponent;
