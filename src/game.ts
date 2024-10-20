import { minBy, compact, map, flatMap, compose, flow } from "lodash/fp";
import { G, UA } from "./physics";
import * as generator from "./generator";
import { add, sub, scale, magnitude } from "./vector";
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
} from "./position";

export type Ship = Movable &
  Hitable & {
    orbit: Planet | null;
    stuckOn: Planet | null;
  };

export interface Player {
  ships: Ship[];
  planetSelected: Planet | null;
}

export type Planet = Positionable &
  Hitable & {
    initialMass: number;
    currentMass: number;
    rotation: number;
  };

export interface Cluster {
  planet: Planet;
  ships: Ship[];
}

export interface Game {
  time: number;
  players: Player[];
  planets: Planet[];
}

export const timer = Math.round(1000 / 24);
export const MapSizeX = 2 * UA;
export const MapSizeY = UA;
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
  (ship: Ship, planet: Planet): Ship => {
    const d = distance(planet, ship); //m
    const f = (G * planet.currentMass * 1) / (d * d); //N = (kg m2 s-2)
    return flow([
      getPosition,
      sub(getPosition(planet)),
      scale((f / d) * second),
      add(getVelocity(ship)),
      setVelocityOf(ship),
    ])(ship);
  };

export const applyGravity =
  (second: number) =>
  (planets: Planet[]) =>
  (ship: Ship): Ship =>
    planets.reduce(deflectShipVelocity(second), ship);

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
      ? flow([bounce(planet), replaceOnSurface(planet), stick(planet)])(ship)
      : ship;
  };

export const isInWorld = ({ position: [x, y] }: Positionable) => {
  return x > 0 && y > 0 && x < MapSizeX && y < MapSizeY;
};

export const planetRadius = (planet: Planet): number =>
  Math.cbrt((3 * planet.currentMass * 1000000) / (4 * Math.PI));

export const gameEventLoop =
  (timer: number) =>
  (game: Game): Game => {
    return {
      ...game,
      time: game.time + timer,
      players: map((player: Player) => ({
        ...player,
        ships: compose(
          map(bounceOnPlanets(game.planets)),
          map(applyGravity(timer)(game.planets)),
          map(move(timer))
          // filter(isInWorld)
        )(player.ships),
      }))(game.players),
    };
  };

export function gameReducer(game: Game, action: GameAction): Game {
  switch (action.type) {
    case "TIME_GONE":
      return gameEventLoop(action.time)(game);
    case "SEND_SHIP":
      return {
        ...game,
        players: game.players.map((player) => {
          return player === action.player
            ? { ...player, ships: [...player.ships, action.ship] }
            : player;
        }),
      };
    case "MOVE_SHIP":
      return {
        ...game,
        players: game.players.map((player) => {
          return player === action.player
            ? {
                ...player,
                ships: player.ships.map((ship) => {
                  return ship === action.ship
                    ? {
                        ...ship,
                        velocity: action.velocity,
                      }
                    : ship;
                }),
              }
            : player;
        }),
      };
    default:
      return game;
  }
}

export type GameAction =
  | { type: "START" }
  | { type: "TIME_GONE"; time: number }
  | { type: "SEND_SHIP"; planet: Planet; player: Player; ship: Ship }
  | { type: "MOVE_SHIP"; player: Player; ship: Ship; velocity: Velocity };

// export const iniatialGameState = generator.generateGame(2);
export const iniatialGameState = generator.generatePuzzle();
