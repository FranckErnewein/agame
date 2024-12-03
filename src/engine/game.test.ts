import { describe, it, expect, vi } from "vitest";
import { merge } from "lodash/fp";
import {
  Planet,
  findCloserPlanet,
  deflectShipVelocity,
  iteratePairs,
  playersAreReady,
} from "./game";
import { createShip, createPlayer } from "./generator";

const defaultPlanet: Planet = {
  mass: 100,
  initialMass: 100,
  rotation: 0,
  radius: 10,
  position: [0, 0],
};
const createPlanet = merge(defaultPlanet);

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
      const s = createShip();
      const ship = deflectShipVelocity(1)(s, p);
      const {
        velocity: [vx, vy],
      } = ship;
      expect(vx).toBeGreaterThan(0);
      expect(vy).toBe(0);
    });
    it("should deflect velocity on left only", () => {
      const p = createPlanet({ position: [-100, 0] });
      const s = createShip();
      expect(deflectShipVelocity(1)(s, p).velocity[0]).toBeLessThan(0);
      expect(deflectShipVelocity(1)(s, p).velocity[1]).toBe(0);
    });
    it("should deflect velocity on bottom only", () => {
      const p = createPlanet({ position: [0, 100] });
      const s = createShip();
      const {
        velocity: [vx, vy],
      } = deflectShipVelocity(1)(s, p);
      expect(vx).toBe(0);
      expect(vy).toBeGreaterThan(0);
    });
    it("should deflect velocity on top only", () => {
      const p = createPlanet({ position: [0, -100] });
      const s = createShip();
      expect(deflectShipVelocity(1)(s, p).velocity[1]).toBeLessThan(0);
      expect(deflectShipVelocity(1)(s, p).velocity[0]).toBe(0);
    });
  });

  describe("iteratePairs", () => {
    it("should be called with all couple of items", () => {
      const o = { fn: (a: number, b: number) => [a + b, b + a] };
      const spy = vi.spyOn(o, "fn");
      iteratePairs(o.fn, [1, 2, 3]);
      expect(spy.mock.calls).toHaveLength(3);
    });
    it("should be called with all couple of items", () => {
      const o = { fn: (a: number, b: number) => [a + b, b + a] };
      const spy = vi.spyOn(o, "fn");
      iteratePairs(o.fn, [1, 2, 3, 4, 5, 6]);
      expect(spy.mock.calls).toHaveLength(5 + 4 + 3 + 2 + 1);
    });
  });
  describe("playersAreReady", () => {
    it("should detect all player ready", () => {
      expect(
        playersAreReady([
          createPlayer({ ready: true }),
          createPlayer({ ready: true }),
        ])
      ).toBe(true);
    });
    it("should detect all player ready", () => {
      expect(
        playersAreReady([
          createPlayer({ ready: false }),
          createPlayer({ ready: true }),
        ])
      ).toBe(false);
    });
  });
});
