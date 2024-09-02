import { G, UA } from "./physics";
import { generateGame } from "./generator";

export interface Position {
  x: number;
  y: number;
}

export interface Positionable {
  position: Position;
}

export interface Velocity {
  x: number;
  y: number;
}

export interface Movable extends Positionable {
  velocity: Velocity;
}

export interface Ship extends Movable {
  orbit: Planet | null;
}

export interface Player {
  ships: Ship[];
  planetSelected: Planet | null;
}

export interface Planet extends Positionable {
  initialMass: number;
  currentMass: number;
  rotation: number;
}

export interface Game {
  time: number;
  players: Player[];
  planets: Planet[];
}

export const timer = Math.round(1000 / 24);
export const MapSizeX = 2 * UA;
export const MapSizeY = UA;
export const week = 60 * 60 * 24 * 7;

export const move =
  (second: number) =>
  <T extends Movable>(m: T): T => ({
    ...m,
    position: nextPosition(second)(m.position)(m.velocity),
  });

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
    const d = distance(planet)(ship);
    const dx = planet.position.x - ship.position.x;
    const dy = planet.position.y - ship.position.y;
    const f = (G * planet.currentMass * 1) / (d * d);
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

export const distance =
  (m1: Positionable) =>
  (m2: Positionable): number =>
    Math.sqrt(
      Math.pow(m1.position.x - m2.position.x, 2) +
        Math.pow(m1.position.y - m2.position.y, 2)
    );

export const isFlying = (ship: Ship) => !!ship.orbit;

export const isInWorld = ({ position: { x, y } }: Positionable) => {
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
      players: game.players.map((player) => ({
        ...player,
        ships: player.ships
          .map(applyGravity(timer)(game.planets))
          .map(move(timer))
          .filter(isInWorld),
      })),
    };
  };

export function gameReducer(game: Game, action: GameAction): Game {
  switch (action.type) {
    case "TIME_GONE":
      return gameEventLoop(action.time)(game);
    case "SEND_SHIP":
      console.log(game, action);
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
