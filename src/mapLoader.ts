import { flatten, zip, flow, filter, map, sortBy, times } from "lodash/fp";

import {
  createShip,
  createSun,
  createPlanet,
  createPlayer,
  randomPosition,
} from "./engine/generator";
import { replaceOnSurface, Position } from "./engine/position";
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
  ships: JSONShip[];
  suns: JSONSpaceObject[];
}

export interface JSONMultiplayer {
  planets: JSONSpaceObject[];
  suns: JSONSpaceObject[];
}

export const createInitialPuzzleGameState = (json: JSONPuzzle): Game => {
  console.log(json);
  return {
    time: 0,
    players: [createPlayer()],
    ships: map(
      ({ position }: JSONShip) => createShip({ position }),
      json.ships
    ),
    planets: map((p: JSONSpaceObject) => createPlanet(p), json.planets),
    suns: map((s: JSONSpaceObject) => createSun(s), json.suns),
  };
};

export const createInitialMultiPlayerGameState = (
  json: JSONMultiplayer
): Game => {
  const planets = map((p: JSONSpaceObject) => createPlanet(p), json.planets);
  const ships = flow([
    zip(json.planets),
    filter(([p]) => !!p.startingPointForPlayer),
    sortBy(([p]) => p.startingPointForPlayer),
    map(([json, planet]) =>
      times(
        flow([
          () =>
            createShip({
              position: randomPosition(),
              player: json.startingPointForPlayer,
            }),
          replaceOnSurface(planet),
        ])
      )(5)
    ),
    flatten,
  ])(planets);
  return {
    time: 0,
    players: times(flow([toString, createPlayer]))(2),
    planets,
    ships,
    suns: map((p: JSONSpaceObject) => createSun(p), json.suns),
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
