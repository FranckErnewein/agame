import { curry } from "lodash";
export type Vec2 = [number, number];

export const add = curry(
  ([x1, y1]: Vec2, [x2, y2]: Vec2): Vec2 => [x1 + x2, y1 + y2]
);

export const sub = curry(
  ([x1, x2]: Vec2, [y1, y2]: Vec2): Vec2 => [x1 - x2, y1 - y2]
);

export const scale = curry((n: number, [x, y]: Vec2): Vec2 => [x * n, y * n]);

export const scalar = curry(
  ([x1, x2]: Vec2, [y1, y2]: Vec2): number => x1 * x2 + y1 * y2
);

export const sym = curry(([ax, ay]: Vec2, [x, y]: Vec2): Vec2 => {
  const dotProduct = x * ax + y * ay; // produit scalaire
  const magnitudeSquared = ax * ax + ay * ay; // norme au carré de v2

  // Calculer le facteur de projection
  const factor = (2 * dotProduct) / magnitudeSquared;

  // Calculer le vecteur symétrique
  const xSym = factor * ax - x;
  const ySym = factor * ay - y;

  return [xSym, ySym];
});

export const rotate90 = ([x, y]: Vec2): Vec2 => [x, -y];

export const sym2 = curry(
  (axe: Vec2, v: Vec2): Vec2 =>
    sub(scale((2 * scalar(axe)(v)) / scalar(axe)(axe))(axe))(v)
);

export const toXY = ([x, y]: Vec2) => ({ x, y });

export const map = curry(
  (f: (n: number) => number, [x, y]: Vec2): Vec2 => [f(x), f(y)]
);

export const angle = ([x, y]: Vec2) => Math.atan2(x, y);
export const magnitude = ([x, y]: Vec2) => Math.sqrt(x * x + y * y);
