import { describe, it, expect } from "vitest";
import { add, sub } from "./vector";

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
