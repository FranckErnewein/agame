import { describe, it, expect } from "vitest";
import {
  distance,
  move,
  replaceOnSurface,
  replaceOnCollision,
  exchangeVelocity,
} from "./position";
import { vec0, movable, positionable, hitable, ship } from "./testUtils";

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
    it("should calculate distance on X", () => {
      expect(distance(positionable(0, 0), positionable(0, 100))).toEqual(100);
    });
    it("should calculate distance on Y", () => {
      expect(distance(positionable(0, 0), positionable(100, 0))).toEqual(100);
    });
  });

  describe("replaceOnSurface", () => {
    it("should replace on Y", () => {
      const planet = hitable(0, 0, 10);
      let ship = hitable(0, 5, 5);
      ship = replaceOnSurface(planet, ship);
      expect(ship.position).toEqual([0, 15]);
      expect(distance(planet, ship)).toEqual(15);
    });
    it("should replace on X", () => {
      const planet = hitable(0, 0, 10);
      let ship = hitable(5, 0, 5);
      ship = replaceOnSurface(planet, ship);
      expect(ship.position).toEqual([15, 0]);
      expect(distance(planet, ship)).toEqual(15);
    });
    it("should replace on X with offset", () => {
      const planet = hitable(10, 10, 10);
      let ship = hitable(15, 10, 5);
      ship = replaceOnSurface(planet, ship);
      expect(ship.position).toEqual([25, 10]);
      expect(distance(planet, ship)).toEqual(15);
    });
    it("should replace on X and Y", () => {
      const planet = hitable(0, 0, 10);
      let ship = hitable(5, 5, 5);
      ship = replaceOnSurface(planet, ship);
      expect(distance(planet, ship)).toBeCloseTo(15, 1);
    });
  });

  describe("replaceOnCollision", () => {
    it("should replace both on X", () => {
      const [h1, h2] = replaceOnCollision([
        hitable(0, 0, 10),
        hitable(15, 0, 10),
      ]);
      expect(h1.position).toEqual([-2.5, 0]);
      expect(h2.position).toEqual([17.5, 0]);
    });
    it("should replace both on Y", () => {
      const [h1, h2] = replaceOnCollision([
        hitable(0, 0, 10),
        hitable(0, 15, 10),
      ]);
      expect(h1.position).toEqual([0, -2.5]);
      expect(h2.position).toEqual([0, 17.5]);
    });
    it("should replace both on X and Y", () => {
      const [h1, h2] = replaceOnCollision([
        hitable(0, 0, 10),
        hitable(15, 15, 10),
      ]);
      expect(distance(h1, h2)).toBeCloseTo(20, 1);
    });
  });
  describe("exchangeVelocity", () => {
    it("should transfert velocity on X", () => {
      const [s1, s2] = exchangeVelocity([
        ship([0, 0], [0, 0]),
        ship([-5, 0], [10, 0]),
      ]);
      expect(vec0(s1.velocity)).toEqual([7.5, 0]);
      expect(vec0(s2.velocity)).toEqual([0, 0]);
    });
  });
});
