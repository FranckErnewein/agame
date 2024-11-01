import { FC, Dispatch } from "react";
import { Container } from "@pixi/react";

import { Game, GameAction, MapSize } from "../game";
import { PlayerUI, PlayerUIAction } from "../playerUI";
import ShipComponent from "./Ship";
import PlanetComponent from "./Planet";
import SunComponent from "./Sun";

interface SpaceComponentProps {
  ui: PlayerUI;
  dispatchUi: Dispatch<PlayerUIAction>;
  game: Game;
  dispatchGame: Dispatch<GameAction>;
}

const Space: FC<SpaceComponentProps> = ({
  ui,
  dispatchUi,
  game,
  dispatchGame,
}) => {
  const [width, height] = MapSize;

  return (
    <Container scale={ui.zoom}>
      <Container {...{ width, height }}>
        {game.planets.map((planet, i) => (
          <PlanetComponent
            key={i}
            {...{ planet, dispatchUi, ui, dispatchGame, game }}
          />
        ))}
        {game.players[0].ships.map((ship, i) => (
          <ShipComponent key={i} {...{ ui, ship, dispatchGame, game }} />
        ))}
        {game.suns.map((sun, i) => (
          <SunComponent key={i} {...{ sun }} />
        ))}
      </Container>
    </Container>
  );
};

export default Space;
