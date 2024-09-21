import { FC } from "react";
import { Sprite, Container } from "@pixi/react";
import { Ship } from "../game";
import { metersToPx, orientation, pxPosition } from "../display";

export interface ShipComponentProps {
  ship: Ship;
}

const ShipComponent: FC<ShipComponentProps> = ({ ship }) => {
  const size = metersToPx(ship.radius * 2);
  return (
    <Container
      alpha={1}
      rotation={orientation(ship)}
      position={pxPosition(ship)}
    >
      <Sprite width={size} height={size} anchor={0.5} image="/ship.png" />
    </Container>
  );
};

export default ShipComponent;
