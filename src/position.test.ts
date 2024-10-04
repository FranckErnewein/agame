import { describe, it, expect } from "vitest";
import { Vec2 } from "./vector";
import {
  Movable,
  Positionable,
  Hitable,
  distance,
  move,
  replaceOnSurface,
} from "./position";

const movable = (
  position: Vec2 = [0, 0],
  velocity: Vec2 = [0, 0]
): Movable => ({
  velocity,
  position,
});

const positionable = (x = 0, y = 0): Positionable => ({
  position: [x, y],
});

const hitable = (x = 0, y = 0, radius = 1): Hitable => ({
  position: [x, y],
  radius,
});

describe("position", () => {
  describe("move", () => {
    it("move right", () => {
      expect(move(1)(movable([0, 0], [0, 2])).position).toEqual([0, 2]);
    });
    it("move bottom", () => {
      expect(move(1)(movable([0, 0], [2, 0])).position).toEqual([2, 0]);
    });
  });

  describe("distance", () => {
    it("should calculate distance", () => {
      expect(distance(positionable(0, 0), positionable(0, 100))).toEqual(100);
    });
  });

  describe("replaceOnSurface", () => {
    it("should calculate distance", () => {
      const fixed = hitable(0, 0, 10);
      const toMove = hitable(0, 5, 5);
      const replaced = replaceOnSurface(fixed, toMove);
      expect(replaced.position).toEqual([0, 15]);
    });
  });
});
