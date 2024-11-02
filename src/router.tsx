import { createBrowserRouter } from "react-router-dom";
import Home from "./components/Home";
import Puzzle from "./components/Puzzle";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/puzzle/:puzzleId",
    element: <Puzzle />,
  },
]);

export default router;
