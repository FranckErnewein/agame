import { describe, it, expect } from "vitest";
import { Movable } from "./position";
import { Planet, findCloserPlanet } from "./game";
import { merge } from "lodash/fp";

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
const defaultPlanet: Planet = {
  currentMass: 100,
  initialMass: 100,
  rotation: 0,
  radius: 10,
  ...defaultMovable,
};

describe("game", () => {
  describe("findCloserPlanet", () => {
    it("should find the closer planet", () => {
      const createPlanet = merge(defaultPlanet);
      const p1 = createPlanet({ position: { x: 1000 } });
      const p2 = createPlanet({ position: { x: 10 } });
      const p3 = createPlanet({ position: { x: 100 } });
      expect(
        findCloserPlanet({ position: { x: 0, y: 0 } })([p1, p2, p3])
      ).toEqual(p2);
    });
  });
});
