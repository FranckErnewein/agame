import { FC, Dispatch } from "react";
import { Container, Sprite } from "@pixi/react";
import { useWindowSize } from "@react-hook/window-size";

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
  const [MapSizeX, MapSizeY] = MapSize;
  const [windowWidth, windowHeight] = useWindowSize();

  return (
    <>
      <Sprite
        width={windowWidth}
        height={windowHeight}
        alpha={0.3}
        image="/sky-bg2.webp"
      />
      <Container scale={ui.zoom}>
        <Container width={MapSizeX} height={MapSizeY}>
          {game.planets.map((planet, i) => (
            <PlanetComponent
              key={i}
              {...{ planet, dispatchUi, ui, dispatchGame, game }}
            />
          ))}
          {game.players.map((player) => {
            return player.ships.map((ship, i) => (
              <ShipComponent key={i} {...{ ui, ship, dispatchGame, game }} />
            ));
          })}
          {game.suns.map((sun, i) => (
            <SunComponent key={i} {...{ sun }} />
          ))}
        </Container>
      </Container>
    </>
  );
};

export default Space;
