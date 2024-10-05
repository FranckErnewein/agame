import { compose } from "lodash/fp";
import { UA } from "./physics";
import { angle, map } from "./vector";
import { getPosition, Positionable, Movable } from "./position";

export const pxPerUA = 500;
export const mpx = UA / pxPerUA;
export const metersToPx = (meters: number) => Math.round(meters / mpx);
export const pxToMeter = (px: number) => px * mpx;

export const toPixiPosition = (p: Positionable): [number, number] => p.position;

export const pxPosition = compose(map(metersToPx), getPosition);

export const orientation = (m: Movable): number => angle(m.velocity);
