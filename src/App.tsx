import "pixi.js";
import { Stage } from "@pixi/react";
import Space from "./components/Space";
import { useWindowSize } from "@react-hook/window-size";

function App() {
  const [width, height] = useWindowSize();
  return (
    <Stage options={{ background: 0x000000 }} width={width} height={height}>
      <Space />
    </Stage>
  );
}

export default App;
