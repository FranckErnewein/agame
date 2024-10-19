import { FC, useReducer } from "react";
import { useTick } from "@pixi/react";
import { gameReducer, iniatialGameState } from "../game";
import { month } from "../time";
import { playerUIReducer, initialPlayerUIState } from "../playerUI";
import ShipComponent from "./Ship";
import PlanetComponent from "./Planet";

const Space: FC = () => {
  const [game, dispatchGame] = useReducer(gameReducer, iniatialGameState);
  const [ui, dispatchUi] = useReducer(playerUIReducer, initialPlayerUIState);
  useTick(() => dispatchGame({ type: "TIME_GONE", time: month }));

  return (
    <>
      {game.planets.map((planet, i) => (
        <PlanetComponent
          key={i}
          {...{ planet, dispatchUi, ui, dispatchGame, game }}
        />
      ))}
      {game.players[0].ships.map((ship, i) => (
        <ShipComponent key={i} {...{ ship, dispatchGame, game }} />
      ))}
    </>
  );
};

export default Space;
