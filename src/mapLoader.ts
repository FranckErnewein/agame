import { last, zip, noop, flow, filter, map, sortBy, times } from "lodash/fp";

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
  const planets = map(
    (p: JSONSpaceObject) => createPlanet(p.mass, p.position),
    json.planets
  );
  const players = flow([
    zip(json.planets),
    filter(([p]) => !!p.startingPointForPlayer),
    sortBy(([p]) => p.startingPointForPlayer),
    map(last),
    map((planet) =>
      createPlayer({
        ships: times(
          flow([noop, randomPosition, createShip, replaceOnSurface(planet)])
        )(5),
      })
    ),
  ])(planets);
  return {
    time: 0,
    players,
    planets,
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
