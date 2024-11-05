import { createBrowserRouter } from "react-router-dom";
import Home from "./components/Home";
import Puzzle from "./components/Puzzle";
import MutliPlayer from "./components/MutliPlayer";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/puzzle/:puzzleId",
    element: <Puzzle />,
  },
  {
    path: "/multi/game/:gameId/:playerId",
    element: <MutliPlayer />,
  },
]);

export default router;
