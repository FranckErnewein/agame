import { minBy, compact, map, filter, flatMap, compose } from "lodash/fp";
import { G, UA } from "./physics";
import { generateGame } from "./generator";
import {
  Position,
  Positionable,
  Velocity,
  Movable,
  Hitable,
  distance,
  move,
  hit,
} from "./position";

export type Ship = Movable &
  Hitable & {
    orbit: Planet | null;
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

export type Clusters = Map<Planet, Ship[]>;

export interface Game {
  time: number;
  players: Player[];
  planets: Planet[];
}

export const timer = Math.round(1000 / 24);
export const MapSizeX = 2 * UA;
export const MapSizeY = UA;
export const week = 60 * 60 * 24 * 7;
export const planetInfluence = 0.001 * UA;
export const planetMinimalDistance = 0.003 * UA;
export const shipMass = 3e23;

export const findCloserPlanet =
  (p: Positionable) =>
  (planets: Planet[]): Planet | undefined =>
    minBy<Planet>(distance(p))(planets);

export const nextPosition =
  (second: number) =>
  (position: Position) =>
  (speed: Velocity): Position => ({
    x: position.x + speed.x * second,
    y: position.y + speed.y * second,
  });

export const deflectShipVelocity =
  (second: number) =>
  (ship: Ship, planet: Planet): Ship => {
    const d = distance(planet)(ship); //m
    const dx = planet.position.x - ship.position.x; //m
    const dy = planet.position.y - ship.position.y; //m
    const f = (G * planet.currentMass * 1) / (d * d); //N = (kg m2 s-2)
    return {
      ...ship,
      velocity: {
        x: ship.velocity.x + f * (dx / d) * second,
        y: ship.velocity.y + f * (dy / d) * second,
      },
    };
  };

export const applyGravity =
  (second: number) =>
  (planets: Planet[]) =>
  (ship: Ship): Ship =>
    planets.reduce(deflectShipVelocity(second), ship);

export const isInWorld = ({ position: { x, y } }: Positionable) => {
  return x > 0 && y > 0 && x < MapSizeX && y < MapSizeY;
};

export const planetRadius = (planet: Planet): number =>
  Math.cbrt((3 * planet.currentMass * 1000000) / (4 * Math.PI));

export const iterateShipsPair = (ships: Ship[]) =>
  compose(
    compact,
    flatMap((ship1: Ship) =>
      map((ship2: Ship) =>
        ship1 !== ship2
          ? {
              pair: [ship1, ship2],
              distance: distance(ship1)(ship2),
            }
          : null
      )
    )
  )(ships);

// Filtrer les nulls (où ship1 == ship2)
export const gameEventLoop =
  (timer: number) =>
  (game: Game): Game => {
    const { planets, players } = game;
    const clusters = new Map<Planet, Ship[]>();
    planets.forEach((p) => clusters.set(p, []));

    players.forEach((player) =>
      player.ships.forEach((ship) => {
        const closerPlanet = findCloserPlanet(ship)(planets);
        if (closerPlanet) clusters.get(closerPlanet)?.push(ship);
      })
    );

    clusters.forEach((ships, planet) => {
      ships.forEach((ship) => {
        if (hit(ship)(planet)) {
          ship.velocity.x = -ship.velocity.x;
          ship.velocity.y = -ship.velocity.y;
        }
      });
    });

    return {
      ...game,
      time: game.time + timer,
      players: map((player: Player) => ({
        ...player,
        ships: compose(
          map(applyGravity(timer)(game.planets)),
          map(move(timer)),
          filter(isInWorld)
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
    default:
      return game;
  }
}

export type GameAction =
  | { type: "START" }
  | { type: "TIME_GONE"; time: number }
  | { type: "SEND_SHIP"; planet: Planet; player: Player; ship: Ship };

export const iniatialGameState = generateGame(2);
