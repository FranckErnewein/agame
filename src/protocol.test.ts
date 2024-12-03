import { describe, it, expect } from "vitest";
import { clone, merge } from "lodash/fp";
import { goToNextLockStep, stepCountForLockStep } from "./protocol";
import { emptyGame } from "./engine/game";

describe("goToNextLockStep", () => {
  it("should not move because game is already at lockstep", () => {
    expect(goToNextLockStep(clone(emptyGame)).step).toEqual(0);
  });
  it("should move to next lockstep", () => {
    expect(goToNextLockStep(merge(emptyGame, { step: 1 })).step).toEqual(
      stepCountForLockStep
    );
  });
  it("should move to next lockstep (after lot of steps pasted)", () => {
    expect(
      goToNextLockStep(merge(emptyGame, { step: 10000 })).step %
        stepCountForLockStep
    ).toEqual(0);
  });
});
