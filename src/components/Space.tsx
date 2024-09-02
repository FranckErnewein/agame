import { FC, useReducer } from "react";
import { useTick } from "@pixi/react";
import { week, gameReducer, iniatialGameState } from "../game";
import { playerUIReducer, initialPlayerUIState } from "../playerUI";
import ShipComponent from "./Ship";
import PlanetComponent from "./Planet";

const Space: FC = () => {
  const [game, dispatchGame] = useReducer(gameReducer, iniatialGameState);
  const [ui, dispatchUi] = useReducer(playerUIReducer, initialPlayerUIState);
  useTick(() => dispatchGame({ type: "TIME_GONE", time: week }));

  return (
    <>
      {game.planets.map((planet, i) => (
        <PlanetComponent
          key={i}
          {...{ planet, dispatchUi, ui, dispatchGame, game }}
        />
      ))}
      {game.players[0].ships.map((ship, i) => (
        <ShipComponent key={i} {...{ ship }} />
      ))}
    </>
  );
};

export default Space;
