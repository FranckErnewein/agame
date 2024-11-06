import { curry, minBy, map, filter, compose, flow } from "lodash/fp";
import { G, UA } from "./physics";
// import * as generator from "./generator";
import { add, sub, scale, magnitude, Vec2 } from "./vector";
import {
  Position,
  Positionable,
  Velocity,
  Movable,
  Hitable,
  distance,
  move,
  hit,
  bounce,
  replaceOnSurface,
  getVelocity,
  setVelocityOf,
  getPosition,
  replaceOnCollision,
  exchangeVelocity,
} from "./position";

export type Ship = Movable &
  Hitable & {
    player: string;
    orbit: Planet | null;
    stuckOn: Planet | null;
  };

export interface Player {
  id: string;
  ready: boolean;
}

export type Planet = Positionable &
  Hitable & {
    initialMass: number;
    mass: number;
    rotation: number;
  };

export type Sun = Positionable &
  Hitable & {
    mass: number;
  };

export type SpaceBody = Sun | Planet;

export interface Cluster {
  planet: Planet;
  ships: Ship[];
}

export interface Game {
  time: number;
  players: Player[];
  ships: Ship[];
  planets: Planet[];
  suns: Sun[];
}

export const timer = Math.round(1000 / 24);
export const MapSizeX = 2 * UA;
export const MapSizeY = 1 * UA;
export const MapSize: Vec2 = [MapSizeX, MapSizeY];
export const shipMass = 3e23;

export const findCloserPlanet =
  (p: Positionable) =>
  (planets: Planet[]): Planet | undefined =>
    minBy<Planet>(distance(p))(planets);

export const nextPosition =
  (second: number) =>
  ([px, py]: Position) =>
  ([vx, vy]: Velocity): Position =>
    [px + vx * second, py + vy * second];

export const deflectShipVelocity =
  (second: number) =>
  (ship: Ship, planet: Planet | Sun): Ship => {
    const d = distance(planet, ship); //m
    const f = (G * planet.mass * 1) / (d * d); //N = (kg m2 s-2)
    return flow([
      getPosition,
      sub(getPosition(planet)),
      scale((f / d) * second),
      add(getVelocity(ship)),
      setVelocityOf(ship),
    ])(ship);
  };

export const applyGravity = curry(
  (second: number, planets: (Planet | Sun)[], ship: Ship): Ship =>
    planets.reduce(deflectShipVelocity(second), ship)
);

export const stick =
  (planet: Planet) =>
  (ship: Ship): Ship =>
    magnitude(ship.velocity) < 100
      ? { ...ship, velocity: [0, 0], stuckOn: planet }
      : ship;

export const bounceOnPlanets =
  (planets: Planet[]) =>
  (ship: Ship): Ship => {
    const planet = planets.find(hit(ship));
    return planet
      ? flow([bounce(0.45, planet), replaceOnSurface(planet)])(ship)
      : ship;
  };

export const collideShips = curry((s1: Ship, s2: Ship): [Ship, Ship] =>
  hit(s1, s2)
    ? flow([replaceOnCollision, exchangeVelocity(0.75)])([s1, s2])
    : [s1, s2]
);

export const iteratePairs = curry(
  <T>(fn: (item1: T, item2: T) => [T, T], items: T[]): T[] => {
    const result = [...items];
    for (let i = 0; i < result.length; i++) {
      for (let j = i + 1; j < result.length; j++) {
        const [n1, n2] = fn(result[i], result[j]);
        result[i] = n1;
        result[j] = n2;
      }
    }
    return result;
  }
);

export const isInWorld = ({ position: [x, y] }: Positionable) => {
  return x > 0 && y > 0 && x < MapSizeX && y < MapSizeY;
};

export const planetRadius = (planet: Planet): number =>
  Math.cbrt((3 * planet.mass * 1000000) / (4 * Math.PI));

export const doesntHitAnySun =
  (suns: Sun[]) =>
  (ship: Ship): boolean => {
    return !suns.find(hit(ship));
  };

export const gameEventLoop =
  (timer: number) =>
  (game: Game): Game => {
    return {
      ...game,
      time: game.time + timer,
      ships: compose(
        filter(doesntHitAnySun(game.suns)),
        map(bounceOnPlanets(game.planets)),
        iteratePairs(collideShips),
        // map(bounceBetweenShip(player.ships)),
        map(applyGravity(timer, [...game.planets, ...game.suns])),
        map(move(timer))
        // filter(isInWorld)
      )(game.ships),
    };
  };

export function gameReducer(game: Game, action: GameAction): Game {
  switch (action.type) {
    case "SELECT_MAP":
      return action.game;
    case "TIME_GONE":
      return gameEventLoop(action.time)(game);
    case "SEND_SHIP":
      return {
        ...game,
        ships: [...game.ships, action.ship],
      };
    case "MOVE_SHIP":
      return {
        ...game,
        ships: game.ships.map((ship) => {
          return ship === action.ship
            ? {
                ...ship,
                velocity: action.velocity,
              }
            : ship;
        }),
      };
    default:
      return game;
  }
}

export type GameAction =
  | { type: "SELECT_MAP"; game: Game }
  | { type: "READY"; playerId: string }
  | { type: "TIME_GONE"; time: number }
  | { type: "SEND_SHIP"; planet: Planet; player: Player; ship: Ship }
  | { type: "MOVE_SHIP"; player: Player; ship: Ship; velocity: Velocity };

// export const iniatialGameState = generator.generateGame(2);
// export const iniatialGameState = generator.generatePuzzle();

export const emptyGame: Game = {
  time: 0,
  players: [],
  planets: [],
  ships: [],
  suns: [],
};
