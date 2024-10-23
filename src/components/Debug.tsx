import { useGameContext } from "../contexts/GameContext";
const Debug = () => {
  const { game } = useGameContext();
  return (
    <div style={{ fontFamily: "monospace" }}>
      {game.time}
      <table>
        <thead>
          <tr>
            <td>x</td>
            <td>y</td>
          </tr>
        </thead>
        <tbody>
          {game.players[0].ships.map((ship, i) => {
            return (
              <tr key={i}>
                <td>{ship.position[0]}</td>
                <td>{ship.position[1]}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default Debug;
