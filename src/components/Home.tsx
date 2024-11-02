import { FC } from "react";
import { Link } from "react-router-dom";

const Home: FC = () => {
  const puzzleIds = ["1", "2"];
  return (
    <div>
      <h2>Puzzle</h2>
      <ul>
        {puzzleIds.map((id) => (
          <li key={id}>
            <Link to={`/puzzle/${id}`}>Puzzle n°{id}</Link>
          </li>
        ))}
      </ul>
      <h2>Multiplayer</h2>
      <button>Create a game</button>
    </div>
  );
};

export default Home;
