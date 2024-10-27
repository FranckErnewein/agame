import { FC } from "react";
import { useWindowSize } from "@react-hook/window-size";
import { Container } from "@pixi/react";

import { Vec2 } from "../vector";
import { Game } from "../game";

interface MinimapProps {
  game: Game;
}

const Minimap: FC<MinimapProps> = () => {
  const [windowWidth, windowHeight] = useWindowSize();
  const margin = 30;
  const height = 100;
  const width = 2 * height;
  const position: Vec2 = [
    windowWidth - width - margin,
    windowHeight - height - margin,
  ];
  return <Container {...{ width, height, position }}></Container>;
};

export default Minimap;
