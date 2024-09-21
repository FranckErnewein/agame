import { Vec2 } from "./vector";

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

export const distance =
  ({ position: [x1, y1] }: Positionable) =>
  ({ position: [x2, y2] }: Positionable): number =>
    Math.sqrt(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2));

export const move =
  (second: number) =>
  <T extends Movable>(m: T): T => ({
    ...m,
    position: nextPosition(second)(m.position)(m.velocity),
  });

export const nextPosition =
  (second: number) =>
  ([px, py]: Vec) =>
  ([vx, vy]: Vec): Vec =>
    [px + vx * second, py + vy * second];

export const hit = (h1: Hitable) => (h2: Hitable) =>
  distance(h1)(h2) < h1.radius + h2.radius;

type Vec = [number, number];
