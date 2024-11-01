import { useCallback, useState, FC } from "react";
import { useWindowSize } from "@react-hook/window-size";
import { Graphics, Container, Sprite } from "@pixi/react";
import * as PIXI from "pixi.js";

import { scale, Vec2 } from "../vector";
import { MapSizeX, MapSizeY, Game } from "../game";
import { PlayerUI } from "../playerUI";

interface MinimapProps {
  game: Game;
  ui: PlayerUI;
  stageSize: Vec2;
}

const Minimap: FC<MinimapProps> = ({ game, ui, stageSize }) => {
  const [windowWidth, windowHeight] = useWindowSize();
  const [drag, setDrag] = useState<boolean>(false);
  const { planets } = game;
  const margin = 30;
  const height = 100;
  const width = 2 * height;
  const position: Vec2 = [
    windowWidth - width - margin,
    windowHeight - height - margin,
  ];

  const drawMinimap = useCallback(
    (g: PIXI.Graphics) => {
      g.clear();
      g.beginFill(0x111111, 1);
      g.lineStyle(1, 0x333333, 1);
      g.drawRect(0, 0, width, height);
      g.endFill();
      planets.forEach((planet) => {
        const mpx = width / MapSizeX;
        const radius = planet.radius * mpx;
        const [x, y] = scale(mpx, planet.position);
        g.lineStyle(0);
        g.beginFill(0xaaaaaa, 0.5);
        g.drawCircle(x, y, radius);
      });
      g.endFill();
    },
    [width, height, planets]
  );

  const drawViewport = useCallback(
    (g: PIXI.Graphics) => {
      const [stageWidth, stageHeight] = stageSize;
      g.clear();
      g.beginFill(0x111111, 0.1);
      g.lineStyle(1, 0x550000, 1);
      g.drawRect(
        0,
        0,
        width * (stageWidth / (MapSizeX * ui.zoom)),
        height * (stageHeight / (MapSizeY * ui.zoom))
      );
      g.endFill();
    },
    [width, height, stageSize, ui.zoom]
  );

  const startDrag = () => setDrag(true);
  const stopDrag = () => setDrag(false);
  const listeners = drag
    ? {
        onpointermove: (e: PointerEvent) => {
          console.log(e);
        },
        onpointerup: stopDrag,
        onpointerupoutside: stopDrag,
      }
    : { onpointerdown: startDrag, onclick: () => console.log("lol") };

  return (
    <Container {...{ position }} onclick={() => console.log("wesh")}>
      <Graphics draw={drawMinimap} {...{ width, height }} position={[0, 0]} />
      <Container eventMode="static" position={[0, 0]} {...listeners}>
        <Graphics draw={drawViewport} />
      </Container>
    </Container>
  );
};

export default Minimap;
