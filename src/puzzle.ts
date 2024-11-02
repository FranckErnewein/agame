import { map } from "lodash/fp";

import { createShip, createSun, createPlanet, createPlayer } from "./generator";
import { Position } from "./position";
import { Game } from "./game";

interface JSONShip {
  position: Position;
}

interface JSONPlayer {
  ships: JSONShip[];
}

interface JSONSpaceObject {
  mass: number;
  position: Position;
}

export interface JSONPuzzle {
  players: JSONPlayer[];
  planets: JSONSpaceObject[];
  suns: JSONSpaceObject[];
}

export const createInitialGameState = (json: JSONPuzzle): Game => {
  return {
    time: 0,
    players: [
      createPlayer({
        ships: map(
          (s: JSONShip) => createShip(s.position),
          json.players[0].ships
        ),
      }),
    ],
    planets: map(
      (p: JSONSpaceObject) => createPlanet(p.mass, p.position),
      json.planets
    ),
    suns: map((p: JSONSpaceObject) => createSun(p.mass, p.position), json.suns),
  };
};

export const loadPuzzle = async (puzzleId: string) => {
  return fetch(`/puzzle/${puzzleId}.json`)
    .then((r) => r.json())
    .then(createInitialGameState);
};
