import { flow, filter, map, sortBy } from "lodash/fp";

import {
  createShip,
  createSun,
  createPlanet,
  createPlayer,
  center,
} from "./engine/generator";
import { getPosition, Position } from "./engine/position";
import { add, sub, scale, revert } from "./engine/vector";
import { Game } from "./engine/game";

interface JSONShip {
  position: Position;
}

interface JSONPlayerPuzzle {
  ships: JSONShip[];
}

interface JSONSpaceObject {
  mass: number;
  position: Position;
  startingPointForPlayer?: number;
}

export interface JSONPuzzle {
  players: JSONPlayerPuzzle[];
  planets: JSONSpaceObject[];
  suns: JSONSpaceObject[];
}

export interface JSONMultiplayer {
  planets: JSONSpaceObject[];
  suns: JSONSpaceObject[];
}

export const createInitialPuzzleGameState = (json: JSONPuzzle): Game => {
  return {
    time: 0,
    players: [
      createPlayer({
        ships: map((s: JSONShip) => createShip(s.position), []),
      }),
    ],
    planets: map(
      (p: JSONSpaceObject) => createPlanet(p.mass, p.position),
      json.planets
    ),
    suns: map((p: JSONSpaceObject) => createSun(p.mass, p.position), json.suns),
  };
};

export const createInitialMultiPlayerGameState = (
  json: JSONMultiplayer
): Game => {
  return {
    time: 0,
    players: flow([
      filter((p: JSONSpaceObject) => !!p.startingPointForPlayer),
      sortBy(["startingPointForPlayer"]),
      map((p: JSONSpaceObject) =>
        flow([
          getPosition,
          sub(center()),
          revert,
          scale(0.00001),
          add(getPosition(p)),
          createShip,
          (ship) => createPlayer({ ships: [ship] }),
        ])(p)
      ),
    ])(json.planets),
    planets: map(
      (p: JSONSpaceObject) => createPlanet(p.mass, p.position),
      json.planets
    ),
    suns: map((p: JSONSpaceObject) => createSun(p.mass, p.position), json.suns),
  };
};

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
