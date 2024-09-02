import { UA } from "./physics";
import { Positionable } from "./game";

interface CSSPosition {
  top: string;
  left: string;
}

export const pxPerUA = 500;
export const mpx = UA / pxPerUA;
export const metersToPx = (meters: number) => Math.round(meters / mpx);
export const pxToMeter = (px: number) => px * mpx;

export const toPixiPosition = (p: Positionable): [number, number] => [
  metersToPx(p.position.x),
  metersToPx(p.position.y),
];

export const screenPosition = (p: Positionable): CSSPosition => ({
  top: `${metersToPx(p.position.y)}px`,
  left: `${metersToPx(p.position.x)}px`,
});
