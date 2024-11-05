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
      <hr />
      <h2>Multiplayer</h2>
      <h3>Join game n°1</h3>
      <ul>
        <li>
          <Link to="/multi/game/1/1">Player 1</Link>
        </li>
        <li>
          <Link to="/multi/game/1/2">Player 2</Link>
        </li>
      </ul>
      <h3>Join game n°2</h3>
      <ul>
        <li>
          <Link to="/multi/game/2/1">Player 1</Link>
        </li>
        <li>
          <Link to="/multi/game/2/2">Player 2</Link>
        </li>
      </ul>
    </div>
  );
};

export default Home;
