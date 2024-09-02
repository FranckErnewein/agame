import { Planet } from "../game";
import { PlayerUIAction } from "../playerUI";
import { createContext, useContext } from "react";

export type Dispatch = (action: PlayerUIAction) => void;

export interface PlayerUIContextType {
  planetSelected: Planet | null;
  dispatch: Dispatch;
}

export const PlayerUIContext = createContext<PlayerUIContextType>({
  planetSelected: null,
  dispatch: () => null,
});

export const usePlayerUIContext = () => useContext(PlayerUIContext);
