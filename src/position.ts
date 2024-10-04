import { set, flow, curry, flip } from "lodash/fp";
import { Vec2, sym, sub, rotate90, add, scale } from "./vector";

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
export const getVelocity = (p: Movable) => p.velocity;
export const setVelocity = set("velocity");

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

export const bounce =
  (p: Positionable) =>
  <M extends Movable>(m: M): M => {
    const bodiesAxe = sub(p.position, m.position);
    const groundAxe = rotate90(bodiesAxe);
    // return flow([
    // getVelocity,
    // sym(groundAxe),
    // sym(bodiesAxe),
    // flip(setVelocity)(m),
    // ])(m);
    return setVelocity(sym(groundAxe, sym(bodiesAxe, m.velocity)))(m);
  };

export const replaceOnSurface = curry(
  (fixed: Hitable) =>
    (h: Hitable): Hitable => {
      return flow([
        getPosition,
        sub(fixed.position),
        scale((h.radius + fixed.radius) / fixed.radius),
        add(fixed.position),
        flip(setPosition)(h),
      ])(h);
    }
);
