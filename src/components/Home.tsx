import { FC } from "react";
import { Link } from "react-router-dom";
import { times } from "lodash/fp";

import init, { add } from "rust-engine";
import { routes, buildUrl } from "../routes";

const run = async () => {
  await init();
  console.log(add(1, 2));
};
run();

const Home: FC = () => {
  const puzzleIds = ["1", "2"];
  return (
    <div style={{ padding: 20 }}>
      <h2>Puzzle</h2>
      <ul>
        {puzzleIds.map((id) => (
          <li key={id}>
            <Link to={buildUrl(routes.PUZZLE, { puzzleId: id })}>
              Puzzle n°{id}
            </Link>
          </li>
        ))}
      </ul>
      <hr />
      <h2>Multiplayer</h2>
      {times((gameN: number) => (
        <>
          <h3>Join game n°{gameN + 1}</h3>
          <ul>
            {times((playerN: number) => (
              <li>
                <Link
                  to={buildUrl(routes.MUTLIPLAYER, {
                    playerId: playerN + 1,
                    gameId: gameN + 1,
                  })}
                >
                  As player {playerN + 1}
                </Link>
              </li>
            ))(2)}
          </ul>
        </>
      ))(2)}
    </div>
  );
};

export default Home;
