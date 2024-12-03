import { flow, reduce } from "lodash/fp";
import {
  stepDuration,
  gameReducer,
  gameEventLoop,
  timer,
  GameAction,
  Game,
} from "./engine/game";

export interface LockStep {
  step: number;
  actions: GameAction[];
}

export interface PlayerCommand {
  action: (action: GameAction) => void;
}

export interface ServerEvent {
  init: (state: Game) => void;
  lockstep: (lockstep: LockStep) => void;
  action: (action: GameAction) => void;
}

const stepCountForLockStep = 16;

const isLockStep = (step: number) => step % stepCountForLockStep === 0;

const nextStep = (game: Game): Game => gameEventLoop(stepDuration)(game);
const goToStep =
  (step: number) =>
  (game: Game): Game =>
    game.step < step ? goToStep(step)(nextStep(game)) : game;

const execActions =
  (actions: GameAction[]) =>
  (game: Game): Game =>
    reduce(gameReducer, game)(actions);

export const createServerRunner = (
  game: Game,
  onChange: (game: Game) => void,
  onLockStep: (lockstep: LockStep) => void
) => {
  let state = game;
  let actions: GameAction[] = [];
  setInterval(() => {
    if (isLockStep(state.step)) {
      state = execActions(actions)(state);
      onLockStep({ step: state.step, actions });
      actions = [];
    }
    state = nextStep(state);
    onChange(state);
  }, timer);
  return (action: GameAction) => {
    actions.push(action);
  };
};

export const createClientRunner = (
  game: Game,
  onChange: (game: Game) => void
) => {
  let state = game;
  let interval: undefined | ReturnType<typeof setInterval> = undefined;
  return (lockstep: LockStep) => {
    clearInterval(interval);
    state = flow([goToStep(lockstep.step), execActions(lockstep.actions)])(
      state
    );
    state = nextStep(state);
    onChange(state);
    interval = setInterval(() => {
      state = nextStep(state);
      onChange(state);
      if (isLockStep(state.step)) {
        clearInterval(interval);
      }
    }, timer);
  };
};
