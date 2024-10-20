import { Planet, MapSizeX } from "./game";
import { Vec2 } from "./vector";

export interface PlayerUI {
  zoom: number;
  planetSelected: Planet | null;
  offset: Vec2;
  viewport: {
    width: number;
    height: number;
  };
}

export type PlayerUIAction =
  | { type: "SELECT_PLANET"; planet: Planet }
  | { type: "UNSELECT" }
  | { type: "ZOOM"; zoom: number }
  | { type: "RESIZE"; width: number; height: number };

export const initialPlayerUIState: PlayerUI = {
  planetSelected: null,
  zoom: 1 / (MapSizeX / 1024),
  offset: [0, 0],
  viewport: {
    width: 1024,
    height: 768,
  },
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
        zoom: action.zoom,
      };
    case "RESIZE":
      return {
        ...state,
        zoom: 1 / (MapSizeX / action.width),
        viewport: { width: action.width, height: action.height },
      };
    default:
      return state;
  }
}
