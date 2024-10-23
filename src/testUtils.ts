import { Vec2, map } from "./vector";
import { Movable, Positionable, Hitable, Position, Velocity } from "./position";
import { Ship } from "./game";

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

export const ship = (p: Position, v: Velocity, radius = 10): Ship => ({
  ...movable(p, v),
  radius,
  orbit: null,
  stuckOn: null,
});

// fix -0 value to 0 in vector to help to write tests (toEqual)
// [-0, -0] => [0, 0]
export const vec0 = map((x: number) => (x === 0 ? 0 : x));
