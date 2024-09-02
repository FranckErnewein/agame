import { move, Movable } from "./game";
import { clone } from "lodash/fp";
import { describe, it, expect } from "vitest";

const defaultMovable: Movable = {
  velocity: {
    speed: 100,
    angle: 0,
  },
  position: {
    x: 0,
    y: 0,
  },
};

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
    movable.velocity.angle = 90;
    expect(move(0.1)(movable).position).toEqual({
      x: 0,
      y: 10,
    });
  });
  it("move top left", () => {
    const movable = clone(defaultMovable);
    movable.velocity.angle = 45;
    expect(move(0.1)(movable).position).toEqual({
      x: 7.07107,
      y: 7.07107,
    });
  });
});
