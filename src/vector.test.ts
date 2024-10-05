import { describe, it, expect } from "vitest";
import { add } from "./vector";

describe("add", () => {
  it("should add", () => {
    expect(add([2, 3], [1, 3])).toEqual([3, 6]);
  });
});
