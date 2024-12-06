import { describe, it, expect } from "vitest";
import { clone } from "lodash/fp";
import { goToStep } from "./protocol";
import { emptyGame } from "./engine/game";

describe("goToNextLockStep", () => {
  it("should not move because game is already at the step", () => {
    expect(goToStep(0)(clone(emptyGame)).step).toEqual(0);
  });
  it("should move to step 10", () => {
    expect(goToStep(10)(clone(emptyGame)).step).toEqual(10);
  });
  it("should not move because step is already past", () => {
    expect(goToStep(5)({ ...emptyGame, step: 10 }).step).toEqual(10);
  });
});
