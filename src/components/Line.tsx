import { FC, useCallback } from "react";
import { Graphics } from "@pixi/react";
import * as PIXI from "pixi.js";
import { Position } from "../position";

export interface LineProps {
  // color: number;
  to: Position;
}

const Line: FC<LineProps> = ({ to }) => {
  const draw = useCallback(
    (g: PIXI.Graphics) => {
      g.clear();
      g.lineStyle(1, 0xffffff, 1);
      g.moveTo(0, 0);
      g.lineTo(to.x, to.y);
    },
    [to]
  );

  return <Graphics draw={draw} />;
};

export default Line;
