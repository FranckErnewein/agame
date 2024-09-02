import { FC, useCallback } from "react";
import { Graphics } from "@pixi/react";
import * as PIXI from "pixi.js";

export interface CircleProps {
  radius: number;
}

const Circle: FC<CircleProps> = () => {
  const draw = useCallback((g: PIXI.Graphics) => {
    g.clear();
    g.beginFill(0xffff0b, 0.5);
    g.drawCircle(0, 0, 150);
    g.endFill();
  }, []);

  return <Graphics draw={draw} alpha={0.15} />;
};

export default Circle;
