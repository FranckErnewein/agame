import { createBrowserRouter } from "react-router-dom";
import Puzzle from "./components/Puzzle";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Puzzle />,
  },
  {
    path: "/puzzle/random",
    element: <Puzzle />,
  },
]);

export default router;
