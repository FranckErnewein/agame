import { FC, useReducer, Dispatch } from "react";
import { useTick, Container } from "@pixi/react";
import { gameReducer, iniatialGameState, MapSizeX, MapSizeY } from "../game";
import * as time from "../time";
import { PlayerUI, PlayerUIAction } from "../playerUI";
import ShipComponent from "./Ship";
import PlanetComponent from "./Planet";

interface SpaceComponentProps {
  ui: PlayerUI;
  dispatchUi: Dispatch<PlayerUIAction>;
}

const Space: FC<SpaceComponentProps> = ({ ui, dispatchUi }) => {
  const [game, dispatchGame] = useReducer(gameReducer, iniatialGameState);
  useTick(() => dispatchGame({ type: "TIME_GONE", time: time.month }));

  return (
    <Container scale={ui.zoom}>
      <Container width={MapSizeX} height={MapSizeY}>
        {game.planets.map((planet, i) => (
          <PlanetComponent
            key={i}
            {...{ planet, dispatchUi, ui, dispatchGame, game }}
          />
        ))}
        {game.players[0].ships.map((ship, i) => (
          <ShipComponent key={i} {...{ ui, ship, dispatchGame, game }} />
        ))}
      </Container>
    </Container>
  );
};

export default Space;
