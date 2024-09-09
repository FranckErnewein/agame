import { times, random } from "lodash/fp";
import { Position, distance } from "./position";
import {
  Player,
  Planet,
  Ship,
  Game,
  MapSizeX,
  MapSizeY,
  shipMass,
  planetMinimalDistance,
} from "./game";
import { UA } from "./physics";

export const createPlayer = (player: Partial<Player> = {}): Player => ({
  planetSelected: null,
  ships: [],
  ...player,
});

const center: () => Position = () => ({
  x: MapSizeX / 2,
  y: MapSizeY / 2,
});

const createDefaultPlayers: (n: number) => Player[] = times(() =>
  createPlayer({})
);

const randomMassForPlanet = () => random(1e24, 1e26);

const randomPosition = () => ({
  x: random(100, MapSizeX - 100),
  y: random(100, MapSizeY - 100),
});

export const massToRadius = (mass: number): number =>
  Math.cbrt((3 * mass * 1000000) / (4 * Math.PI));

const createPlanet = (
  mass: number,
  position = center(),
  rotation = 0
): Planet => ({
  initialMass: mass,
  currentMass: mass,
  radius: massToRadius(mass),
  rotation,
  position,
});

export const createShip = (
  position = center(),
  velocity = { x: 0, y: 0 }
): Ship => ({
  orbit: null,
  radius: massToRadius(shipMass),
  position,
  velocity,
});

const until =
  <T>(predicate: (value: T) => boolean) =>
  (fn: () => T): T => {
    let result = fn();
    while (!predicate(result)) result = fn();
    return result;
  };

const createRandomPlanet = (exclude: Planet[] = []): Planet =>
  createPlanet(
    randomMassForPlanet(),
    until(
      (p: Position) =>
        !exclude.find(
          (planet) => distance({ position: p })(planet) < planetMinimalDistance
        )
    )(randomPosition)
  );

export const generateRandomPlanets = (count: number): Planet[] => {
  const planets: Planet[] = [];
  while (planets.length < count) {
    planets.push(createRandomPlanet(planets));
  }
  return planets;
};

export function generateRandomGame(playerCount: number): Game {
  console.log("generateRandomGame", playerCount, "(fake params)");

  return {
    time: 0,
    players: [
      createPlayer({
        ships: [
          {
            radius: massToRadius(shipMass),
            orbit: null,
            position: { x: UA / 2, y: UA / 2 },
            velocity: { x: 400, y: -100 },
          },
        ],
      }),
      createPlayer(),
    ],
    planets: generateRandomPlanets(random(2, 5)),
  };
}

export function physiqueTest(): Game {
  return {
    time: 0,
    players: createDefaultPlayers(2),
    planets: times(() => createPlanet(randomMassForPlanet()))(random(5, 15)),
  };
}

export const generateGame = generateRandomGame;
