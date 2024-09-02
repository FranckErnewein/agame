import { Planet } from "./game";

export interface PlayerUI {
  planetSelected: Planet | null;
}

export type PlayerUIAction =
  | { type: "SELECT_PLANET"; planet: Planet }
  | { type: "UNSELECT" };

export const initialPlayerUIState: PlayerUI = {
  planetSelected: null,
};

export function playerUIReducer(state: PlayerUI, action: PlayerUIAction) {
  switch (action.type) {
    case "SELECT_PLANET":
      return {
        ...state,
        planetSelected: action.planet,
      };
    case "UNSELECT":
      return {
        ...state,
        planetSelected: null,
      };
    default:
      return state;
  }
}
