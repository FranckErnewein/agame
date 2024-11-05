import { GameAction } from "./engine/game";

export interface PlayerCommand {
  action: (action: GameAction) => void;
}
export interface GameEvent {
  action: (action: GameAction) => void;
}
