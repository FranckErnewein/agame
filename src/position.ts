export interface Vector {
  x: number;
  y: number;
}

export type Position = Vector;
export type Velocity = Vector;

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
  (m1: Positionable) =>
  (m2: Positionable): number =>
    Math.sqrt(
      Math.pow(m1.position.x - m2.position.x, 2) +
        Math.pow(m1.position.y - m2.position.y, 2)
    );

export const move =
  (second: number) =>
  <T extends Movable>(m: T): T => ({
    ...m,
    position: nextPosition(second)(m.position)(m.velocity),
  });

export const nextPosition =
  (second: number) =>
  (position: Position) =>
  (speed: Velocity): Position => ({
    x: position.x + speed.x * second,
    y: position.y + speed.y * second,
  });

export const hit = (h1: Hitable) => (h2: Hitable) =>
  distance(h1)(h2) < h1.radius + h2.radius;

type Vec = [number, number];

export const nextPositionV =
  (second: number) =>
  ([px, py]: Vec) =>
  ([vx, vy]: Vec): Vec =>
    [px + vx * second, py + vy * second];
