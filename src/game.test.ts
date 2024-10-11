import { describe, it, expect } from "vitest";
import { Planet, Ship, findCloserPlanet, deflectShipVelocity } from "./game";
import { merge } from "lodash/fp";
import { movable } from "./testUtils";

const defaultPlanet: Planet = {
  currentMass: 100,
  initialMass: 100,
  rotation: 0,
  radius: 10,
  position: [0, 0],
};
const createPlanet = merge(defaultPlanet);
const ship = (): Ship => ({ ...movable(), radius: 10, orbit: null });

describe("game", () => {
  describe("findCloserPlanet", () => {
    it("should find the closer planet", () => {
      const p1 = createPlanet({ position: [1000, 0] });
      const p2 = createPlanet({ position: [10, 0] });
      const p3 = createPlanet({ position: [100, 0] });
      expect(findCloserPlanet({ position: [0, 0] })([p1, p2, p3])).toEqual(p2);
    });
  });
  describe("deflectShipVelocity", () => {
    it("should deflect velocity on right only", () => {
      const p = createPlanet({ position: [100, 0] });
      const s = ship();
      expect(deflectShipVelocity(1)(s, p).velocity[0]).toBeGreaterThan(0);
      expect(deflectShipVelocity(1)(s, p).velocity[1]).toBe(0);
    });
    it("should deflect velocity on left only", () => {
      const p = createPlanet({ position: [-100, 0] });
      const s = ship();
      expect(deflectShipVelocity(1)(s, p).velocity[0]).toBeLessThan(0);
      expect(deflectShipVelocity(1)(s, p).velocity[1]).toBe(0);
    });
    it("should deflect velocity on bottom only", () => {
      const p = createPlanet({ position: [0, 100] });
      const s = ship();
      expect(deflectShipVelocity(1)(s, p).velocity[1]).toBeGreaterThan(0);
      expect(deflectShipVelocity(1)(s, p).velocity[0]).toBe(0);
    });
    it("should deflect velocity on top only", () => {
      const p = createPlanet({ position: [0, -100] });
      const s = ship();
      expect(deflectShipVelocity(1)(s, p).velocity[1]).toBeLessThan(0);
      expect(deflectShipVelocity(1)(s, p).velocity[0]).toBe(0);
    });
  });
});
