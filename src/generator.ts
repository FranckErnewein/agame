import { times, random } from "lodash/fp";
import { MapSizeX, MapSizeY, Player, Planet, Game } from "./game";
import { UA } from "./physics";

function createPlayer(): Player {
  return {
    planetSelected: null,
    ships: [
      {
        orbit: null,
        position: { x: UA / 2, y: UA / 2 },
        velocity: { x: 400, y: -100 },
      },
    ],
  };
}

function createRandomPlanet(): Planet {
  const mass = random(1e24, 1e26);
  return {
    initialMass: mass,
    currentMass: mass,
    position: {
      x: random(100, MapSizeX - 100),
      y: random(100, MapSizeY - 100),
    },
    rotation: 0,
  };
}

export function generateGame(playerCount: number): Game {
  const players = times(createPlayer)(playerCount);
  const planets = times(createRandomPlanet)(random(5, 15));

  return {
    time: 0,
    players,
    planets,
  };
}
