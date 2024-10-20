import { Planet } from "./game";
import { UA } from "./physics";

export interface PlayerUI {
  zoom: number;
  planetSelected: Planet | null;
}

export type PlayerUIAction =
  | { type: "SELECT_PLANET"; planet: Planet }
  | { type: "UNSELECT" }
  | { type: "ZOOM"; meterPerPixel: number };

export const initialPlayerUIState: PlayerUI = {
  zoom: 1 / (UA / 500),
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
    case "ZOOM":
      return {
        ...state,
        zoom: action.meterPerPixel,
      };
    default:
      return state;
  }
}
