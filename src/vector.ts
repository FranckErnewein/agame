import { curry } from "lodash/fp";

export type Vec2 = [number, number];

export const add = curry(
  ([x1, y1]: Vec2, [x2, y2]: Vec2): Vec2 => [x1 + x2, y1 + y2]
);

export const sub = curry(
  ([x1, y1]: Vec2, [x2, y2]: Vec2): Vec2 => [x1 - x2, y1 - y2]
);

export const scale = curry((n: number, [x, y]: Vec2): Vec2 => [x * n, y * n]);

export const scalar = curry(
  ([x1, y1]: Vec2, [x2, y2]: Vec2): number => x1 * x2 + y1 * y2
);
export const create = curry(
  (angle: number, size: number): Vec2 => [
    size * Math.cos(angle),
    size * Math.sin(angle),
  ]
);

export const rotate90 = ([x, y]: Vec2): Vec2 => [x, -y];
export const revert = scale(-1);

export const sym = curry((axe: Vec2, v: Vec2): Vec2 => {
  if (eq(axe, [0, 0])) throw "symetrie axe can not be [0,0]";
  const factor: number = (2 * scalar(axe, v)) / scalar(axe, axe);
  return sub(scale(factor, axe), v);
});

export const toXY = ([x, y]: Vec2) => ({ x, y });

export const map = curry(
  (f: (n: number) => number, [x, y]: Vec2): Vec2 => [f(x), f(y)]
);

export const angle = ([x, y]: Vec2) => Math.atan2(x, y);
export const magnitude = ([x, y]: Vec2) => Math.sqrt(x * x + y * y);
export const normalize = (v: Vec2): Vec2 => scale(1 / magnitude(v), v);

export const eq = curry(
  ([x1, y1]: Vec2, [x2, y2]: Vec2): boolean => x1 === x2 && y1 === y2
);
