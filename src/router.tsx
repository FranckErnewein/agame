import { createBrowserRouter } from "react-router-dom";
import { routes } from "./routes";
import Home from "./components/Home";
import Puzzle from "./components/Puzzle";
import MutliPlayer from "./components/MutliPlayer";

const router = createBrowserRouter([
  { path: routes.HOME, element: <Home /> },
  { path: routes.PUZZLE, element: <Puzzle /> },
  { path: routes.MUTLIPLAYER, element: <MutliPlayer /> },
]);

export default router;
