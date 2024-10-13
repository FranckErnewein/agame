import { FC } from "react";
import { Stage } from "@pixi/react";

import { metersToPx, pxPosition } from "../../display";
import { replaceOnSurface, Hitable } from "../../position";
import Circle from "../Circle";

const Replace: FC = () => {
  const planet: Hitable = { position: [100, 100], radius: 20 };

  return (
    <div>
      <Stage width={200} height={200}>
        <Circle
          radius={metersToPx(planet.radius)}
          position={pxPosition(planet)}
        />
      </Stage>
      <button>replaceOnSurface</button>
    </div>
  );
};

export default Replace;
