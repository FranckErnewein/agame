import { useReducer, ReactNode } from "react";
import { PlayerUIContext } from "./PlayerUIContext";
import { playerUIReducer, initialPlayerUIState } from "../playerUI";

export type PlayerUIProviderProps = {
  children: ReactNode;
};

export default function PlayerUIProvider({ children }: PlayerUIProviderProps) {
  const [state, dispatch] = useReducer(playerUIReducer, initialPlayerUIState);

  return (
    <PlayerUIContext.Provider value={{ ...state, dispatch }}>
      {children}
    </PlayerUIContext.Provider>
  );
}
