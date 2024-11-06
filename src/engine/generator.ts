import { toString, map, times, random } from "lodash/fp";

import { Vec2 } from "./vector";
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

export const defaultPlayer = {
  id: "1",
  ready: false,
};
export const createPlayer = (player?: Partial<Player>): Player => ({
  ...defaultPlayer,
  ...player,
});

const center = (): Position => [MapSizeX / 2, MapSizeY / 2];
const zeroZero = (): Vec2 => [0, 0];

const randomMassForPlanet = () => random(5e24, 5e25);
const randomMassForSun = () => random(9e24, 6e25);

export const randomPosition = (): Position => [
  random(100, MapSizeX - 100),
  random(100, MapSizeY - 100),
];

export const massToRadius = (mass: number): number =>
  Math.cbrt((3 * mass * 1000000) / (4 * Math.PI));

export const defaultPlanet = (): Planet => ({
  mass: 2e25,
  initialMass: 2e25,
  position: center(),
  rotation: 0,
  radius: massToRadius(2e25),
});
export const createPlanet = (planet: Partial<Planet>): Planet => ({
  ...defaultPlanet(),
  ...planet,
});

export const defaultSun = (): Sun => ({
  position: center(),
  mass: 4e25,
  radius: massToRadius(4e25),
});
export const createSun = (sun: Partial<Sun>): Sun => ({
  ...defaultSun(),
  ...sun,
});

const defaultShip = (): Ship => ({
  player: "1",
  position: zeroZero(),
  stuckOn: null,
  radius: massToRadius(shipMass),
  velocity: zeroZero(),
  orbit: null,
});
export const createShip = (ship: Partial<Ship> = {}): Ship => ({
  ...defaultShip(),
  ...ship,
});

const until =
  <T>(predicate: (value: T) => boolean) =>
  (fn: () => T): T => {
    let result = fn();
    while (!predicate(result)) result = fn();
    return result;
  };

const createRandomPlanet = (exclude: Planet[] = []): Planet =>
  createPlanet({
    mass: randomMassForPlanet(),
    position: until(
      (p: Position) =>
        !exclude.find(
          (planet) => distance({ position: p })(planet) < planetMinimalDistance
        )
    )(randomPosition),
  });

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
    players: [createPlayer({ id: "1" }), createPlayer({ id: "2" })],
    ships: [
      {
        player: "1",
        radius: massToRadius(shipMass),
        orbit: null,
        stuckOn: null,
        position: [UA / 2, UA / 2],
        velocity: [400, -100],
      },
    ],
    planets: generateRandomPlanets(random(2, 5)),
    suns: [],
  };
}

export function generatePuzzle(): Game {
  const ships: Ship[] = times((id) => createShip({ player: toString(id) }))(7);
  const planets = map((p: Position) =>
    createPlanet({ mass: randomMassForPlanet(), ...p })
  )([
    [UA * 0.25, UA * 0.25],
    [UA * 1.75, UA * 0.25],
    [UA * 0.25, UA * 0.75],
    [UA * 1.75, UA * 0.75],
  ]);
  const suns = [
    createSun({ mass: randomMassForSun(), position: [UA, UA * 0.5] }),
    createSun({ mass: randomMassForSun(), position: [UA, UA * 0.9] }),
  ];

  const startingPlanet = planets[0];
  return {
    time: 0,
    players: [createPlayer({ id: "1" })],
    ships: map(replaceOnSurface(startingPlanet), ships),
    planets,
    suns,
  };
}

export const generateGame = generateRandomGame;
