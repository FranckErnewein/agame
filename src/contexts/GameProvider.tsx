import { useReducer, ReactNode } from "react";

import { gameReducer } from "../game";
import { generateGame } from "../generator";
import { GameContext } from "./GameContext";

export type GameProviderProps = {
  children: ReactNode;
};

const game = generateGame(2);

export default function GameProvider({ children }: GameProviderProps) {
  const [state, dispatch] = useReducer(gameReducer, game);

  // console.log(state.players[0].ships[0]?.position.x);

  return (
    <GameContext.Provider value={{ game: state, dispatch }}>
      {children}
    </GameContext.Provider>
  );
}
