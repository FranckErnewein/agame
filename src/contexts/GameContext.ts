import { Game, GameAction } from "../game";
import { generateGame } from "../generator";
import { createContext, useContext } from "react";

export type Dispatch = (action: GameAction) => void;

export interface GameContextType {
  game: Game;
  dispatch: Dispatch;
}

const game = generateGame(2);
export const GameContext = createContext<GameContextType>({
  game,
  dispatch: () => null,
});

export const useGameContext = () => useContext(GameContext);
