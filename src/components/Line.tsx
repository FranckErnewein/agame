import { FC, useCallback } from "react";
import { Graphics } from "@pixi/react";
import * as PIXI from "pixi.js";
import { Position } from "../position";

export interface LineProps {
  // color: number;
  to: Position;
  alpha?: number;
}

const Line: FC<LineProps> = ({ to, alpha = 1 }) => {
  const [x, y] = to;
  const draw = useCallback(
    (g: PIXI.Graphics) => {
      g.clear();
      g.lineStyle(1, 0xffffff, alpha);
      g.moveTo(0, 0);
      g.lineTo(x, y);
    },
    [x, y, alpha]
  );

  return <Graphics draw={draw} />;
};

export default Line;
