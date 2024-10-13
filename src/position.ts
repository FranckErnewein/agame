import { set, flow, curry } from "lodash/fp";
import { Vec2, sym, sub, rotate90, add, scale, revert } from "./vector";

export type Position = Vec2;
export type Velocity = Vec2;

export interface Positionable {
  position: Position;
}

export interface Movable extends Positionable {
  velocity: Velocity;
}

export interface Hitable extends Positionable {
  radius: number;
}

export const getPosition = (p: Positionable) => p.position;
export const setPosition = set("position");
export const setPositionOf = curry(
  <P extends Positionable>(o: P, position: Position) => ({ ...o, position })
);
export const getVelocity = (p: Movable) => p.velocity;
export const setVelocity = set("velocity");
export const setVelocityOf = curry(
  <M extends Movable>(o: M, velocity: Velocity) => ({ ...o, velocity })
);

export const distance = curry(
  (
    { position: [x1, y1] }: Positionable,
    { position: [x2, y2] }: Positionable
  ): number => Math.sqrt(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2))
);

export const move =
  (second: number) =>
  <T extends Movable>(m: T): T =>
    setPosition(add(m.position)(scale(second)(m.velocity)))(m);

export const hit =
  (h1: Hitable) =>
  (h2: Hitable): boolean =>
    distance(h1)(h2) < h1.radius + h2.radius;

export const bounce = curry(<M extends Movable>(p: Positionable, m: M): M => {
  const bodiesAxe = sub(p.position, m.position);
  return flow([getVelocity, sym(bodiesAxe), scale(-3 / 4), setVelocityOf(m)])(
    m
  );
});

export const replaceOnSurface = curry((fixed: Hitable, h: Hitable): Hitable => {
  return flow([
    getPosition,
    sub(getPosition(fixed)),
    revert,
    scale(1 / distance(fixed, h)),
    scale(h.radius + fixed.radius),
    add(getPosition(fixed)),
    setPositionOf(h),
  ])(h);
});
