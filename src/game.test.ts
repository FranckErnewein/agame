import { describe, it, expect } from "vitest";
import { Planet, findCloserPlanet } from "./game";
import { merge } from "lodash/fp";

const defaultPlanet: Planet = {
  currentMass: 100,
  initialMass: 100,
  rotation: 0,
  radius: 10,
  position: [0, 0],
};

describe("game", () => {
  describe("findCloserPlanet", () => {
    it("should find the closer planet", () => {
      const createPlanet = merge(defaultPlanet);
      const p1 = createPlanet({ position: [1000, 0] });
      const p2 = createPlanet({ position: [10, 0] });
      const p3 = createPlanet({ position: [100, 0] });
      expect(findCloserPlanet({ position: [0, 0] })([p1, p2, p3])).toEqual(p2);
    });
  });
});
