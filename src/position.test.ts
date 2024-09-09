import { describe, it, expect } from "vitest";
import { clone } from "lodash/fp";
import { Movable, distance, move } from "./position";

const defaultMovable: Movable = {
  velocity: {
    x: 100,
    y: 0,
  },
  position: {
    x: 0,
    y: 0,
  },
};

describe("position", () => {
  describe("move", () => {
    it("move right", () => {
      const movable = clone(defaultMovable);
      expect(move(0.1)(movable).position).toEqual({
        x: 10,
        y: 0,
      });
    });
    it("move bottom", () => {
      const movable = clone(defaultMovable);
      movable.velocity.y = 10;
      expect(move(0.1)(movable).position).toEqual({
        x: 10,
        y: 1,
      });
    });
  });

  describe("distance", () => {
    it("should calculate distance", () => {
      expect(
        distance({ position: { x: 0, y: 0 } })({ position: { x: 100, y: 0 } })
      ).toEqual(100);
    });
  });
});
