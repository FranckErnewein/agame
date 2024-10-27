import { set, flow, curry } from "lodash/fp";
import {
  normalize,
  sym,
  sub,
  add,
  scale,
  revert,
  magnitude,
  Vec2,
} from "./vector";

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
    flow([getVelocity, scale(second), add(getPosition(m)), setPositionOf(m)])(
      m
    );

export const hit = curry(
  (h1: Hitable, h2: Hitable): boolean =>
    distance(h1, h2) < h1.radius + h2.radius
);

export const bounce = curry(
  <M extends Movable>(elasticty: number, p: Positionable, m: M): M =>
    flow([
      getVelocity,
      sym(sub(p.position, m.position)), //symetrie on axe between objects
      revert,
      scale(elasticty),
      setVelocityOf(m),
    ])(m)
);

export const replaceOnSurface = curry(
  <H extends Hitable>(fixed: Hitable, h: H): H =>
    flow([
      getPosition,
      sub(getPosition(fixed)),
      revert,
      normalize,
      scale(h.radius + fixed.radius),
      add(getPosition(fixed)),
      setPositionOf(h),
    ])(h)
);

export const replaceOnCollision = <T extends Hitable>([h1, h2]: [T, T]): [
  T,
  T
] => {
  const length = (h1.radius + h2.radius - distance(h1, h2)) / 2;
  const replace = (subject: T, other: T): T =>
    flow([
      getPosition,
      sub(getPosition(other)),
      revert,
      normalize,
      scale(length),
      add(getPosition(subject)),
      setPositionOf(subject),
    ])(subject);
  return [replace(h1, h2), replace(h2, h1)];
};

export const exchangeVelocity =
  <T extends Movable>(elasticty: number) =>
  ([h1, h2]: [T, T]): [T, T] => {
    const replace = (subject: T, other: T) =>
      flow([
        getPosition,
        sub(getPosition(other)),
        normalize,
        revert,
        scale(elasticty * magnitude(getVelocity(other))),
        setVelocityOf(subject),
      ])(subject);
    return [replace(h1, h2), replace(h2, h1)];
  };
