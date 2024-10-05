import { Vec2 } from "./vector";
import { Movable, Positionable, Hitable } from "./position";

export const movable = (
  position: Vec2 = [0, 0],
  velocity: Vec2 = [0, 0]
): Movable => ({
  velocity,
  position,
});

export const positionable = (x = 0, y = 0): Positionable => ({
  position: [x, y],
});

export const hitable = (x = 0, y = 0, radius = 1): Hitable => ({
  position: [x, y],
  radius,
});
