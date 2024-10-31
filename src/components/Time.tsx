import { FC } from "react";
import { pick, flow } from "lodash/fp";
import { Text } from "@pixi/react";
import { TextStyle } from "pixi.js";
import { intervalToDuration, formatDurationWithOptions } from "date-fns/fp";

interface TimeProps {
  time: number;
}

const style = new TextStyle({
  align: "center",
  fontFamily: ["monospace"],
  fontSize: 16,
  fontWeight: "400",
  fill: "#ccc",
  strokeThickness: 0,
  wordWrap: true,
  wordWrapWidth: 440,
});

const displayTime = flow([
  (end) => ({ start: 0, end }),
  intervalToDuration,
  pick(["years", "months", "days"]),
  formatDurationWithOptions({ delimiter: ", " }),
]);

const Time: FC<TimeProps> = ({ time }) => {
  return <Text position={[20, 20]} text={displayTime(time)} style={style} />;
};

export default Time;
