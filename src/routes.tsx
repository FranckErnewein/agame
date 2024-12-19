import { toString, map, reduce, flow } from "lodash/fp";
export const routes = {
  HOME: "/",
  PUZZLE: "/puzzle/:puzzleId",
  MUTLIPLAYER: "/multi/:gameId/player/:playerId",
} as const;

type RouterValue = (typeof routes)[keyof typeof routes];

export const buildUrl = (
  route: RouterValue,
  params: Record<string, string | number>
): string => {
  return flow([
    Object.keys,
    map(toString),
    reduce(
      (prev, current: string) =>
        prev.replace(`:${current}`, toString(params[current])),
      toString(route)
    ),
  ])(params);
};
