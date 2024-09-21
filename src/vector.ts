export type Vec2 = [number, number];

export const add =
  ([x1, y1]: Vec2) =>
  ([x2, y2]: Vec2): Vec2 =>
    [x1 + x2, y1 + y2];

export const sub =
  ([x1, x2]: Vec2) =>
  ([y1, y2]: Vec2): Vec2 =>
    [x1 - x2, y1 - y2];

export const scale =
  (n: number) =>
  ([x, y]: Vec2): Vec2 =>
    [x * n, y * n];

export const toXY = ([x, y]: Vec2) => ({ x, y });

export const map =
  (f: (n: number) => number) =>
  ([x, y]: Vec2): Vec2 =>
    [f(x), f(y)];

export const getAngle = ([x, y]: Vec2) => Math.atan2(x, y);
