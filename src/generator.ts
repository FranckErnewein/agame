import { Vec2 } from "./vector";
import { map, times, random } from "lodash/fp";
import { Position, distance, replaceOnSurface } from "./position";
import {
  Player,
  Planet,
  Sun,
  Ship,
  Game,
  MapSizeX,
  MapSizeY,
  shipMass,
} from "./game";
import { UA } from "./physics";

export const planetMinimalDistance = 0.003 * UA;

export const createPlayer = (player: Partial<Player> = {}): Player => ({
  ready: false,
  planetSelected: null,
  ships: [],
  ...player,
});

const center = (): Position => [MapSizeX / 2, MapSizeY / 2];

const createDefaultPlayers: (n: number) => Player[] = times(() =>
  createPlayer({})
);

const randomMassForPlanet = () => random(5e24, 5e25);
const randomMassForSun = () => random(9e24, 6e25);

const randomPosition = (): Position => [
  random(100, MapSizeX - 100),
  random(100, MapSizeY - 100),
];

export const massToRadius = (mass: number): number =>
  Math.cbrt((3 * mass * 1000000) / (4 * Math.PI));

export const createPlanet = (
  mass: number,
  position = center(),
  rotation = 0
): Planet => ({
  initialMass: mass,
  mass: mass,
  radius: massToRadius(mass),
  rotation,
  position,
});

export const createSun = (mass: number, position = center()): Sun => ({
  mass,
  position,
  radius: massToRadius(mass),
});

export const createShip = (
  position = center(),
  velocity: Vec2 = [0, 0]
): Ship => ({
  orbit: null,
  stuckOn: null,
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
            stuckOn: null,
            position: [UA / 2, UA / 2],
            velocity: [400, -100],
          },
        ],
      }),
      createPlayer(),
    ],
    planets: generateRandomPlanets(random(2, 5)),
    suns: [],
  };
}

export function generatePuzzle(): Game {
  const ships: Ship[] = times(() => createShip(randomPosition()), 7);
  const planets = map((p: Position) => createPlanet(randomMassForPlanet(), p))([
    [UA * 0.25, UA * 0.25],
    [UA * 1.75, UA * 0.25],
    [UA * 0.25, UA * 0.75],
    [UA * 1.75, UA * 0.75],
  ]);
  const suns = [
    createSun(randomMassForSun(), [UA, UA * 0.5]),
    createSun(randomMassForSun(), [UA, UA * 0.9]),
  ];

  const startingPlanet = planets[0];
  return {
    time: 0,
    players: [
      createPlayer({ ships: map(replaceOnSurface(startingPlanet), ships) }),
    ],
    planets,
    suns,
  };
}

export function physiqueTest(): Game {
  return {
    time: 0,
    players: createDefaultPlayers(2),
    planets: times(() => createPlanet(randomMassForPlanet()))(random(5, 15)),
    suns: [],
  };
}

export const generateGame = generateRandomGame;
