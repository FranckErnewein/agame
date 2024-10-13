import { FC, useCallback } from "react";
import { Graphics } from "@pixi/react";
import { Position } from "../position";
import * as PIXI from "pixi.js";

export interface CircleProps {
  radius: number;
  position?: Position;
  color?: number;
  alpha?: number;
}

const Circle: FC<CircleProps> = ({
  radius,
  position = [0, 0],
  color = 0xffffff,
  alpha = 0.15,
}) => {
  const draw = useCallback(
    (g: PIXI.Graphics) => {
      g.clear();
      g.beginFill(color, 0.5);
      g.drawCircle(0, 0, radius);
      g.endFill();
    },
    [color, radius]
  );

  return <Graphics {...{ alpha, draw, position }} />;
};

export default Circle;
