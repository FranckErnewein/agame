export type Vec2 = [number, number];

export const add =
  ([x1, x2]: Vec2) =>
  ([y1, y2]: Vec2): Vec2 =>
    [x1 + x2, y1 + y2];

export const scale =
  (n: number) =>
  ([x, y]: Vec2): Vec2 =>
    [x * n, y * n];

export const toXY = ([x, y]: Vec2) => ({ x, y });
