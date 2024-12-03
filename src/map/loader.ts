import { Game } from "../engine/game";
import {
  createInitialPuzzleGameState,
  createInitialMultiPlayerGameState,
} from "./parser";

export const loadPuzzle = async (puzzleId: string): Promise<Game> => {
  return fetch(`/puzzle/${puzzleId}.json`)
    .then((r) => r.json())
    .then(createInitialPuzzleGameState);
};

export const loadMultiPlayer = async (mapId: string): Promise<Game> => {
  return fetch(`/maps/${mapId}.json`)
    .then((r) => r.json())
    .then(createInitialMultiPlayerGameState);
};
