import { useParams } from "react-router-dom";

export const useGameParams = () =>
  useParams<{
    gameId: string;
    playerId: string;
  }>();
