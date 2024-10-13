import { describe, it, expect } from "vitest";
import { add, sub, scalar, sym } from "./vector";

describe("add", () => {
  it("should add", () => {
    expect(add([2, 3], [1, 3])).toEqual([3, 6]);
  });
});

describe("sub", () => {
  it("0 sub something", () => {
    expect(sub([0, 0], [1, 3])).toEqual([-1, -3]);
  });
});

describe("scalar", () => {
  it("apply scalar", () => {
    expect(scalar([2, 3], [4, 5])).toEqual(23);
  });
});

describe("sym", () => {
  it("symetry on X", () => {
    expect(sym([1, 0], [5, 10])).toEqual([5, -10]);
  });
  it("symetry on Y", () => {
    expect(sym([0, 1], [5, 10])).toEqual([-5, 10]);
  });
  it("symetry on 45°", () => {
    expect(sym([1, 1], [0, 10])).toEqual([10, 0]);
  });
});
