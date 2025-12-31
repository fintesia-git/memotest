import { useState } from "react";
import { buildBoard, getCardImage } from "./deck";
import "./index.css";

export default function App() {

  const [screen, setScreen] = useState("home");
  const [numPlayers, setNumPlayers] = useState(2);
  const [playerNames, setPlayerNames] = useState(["Jugador 1", "Jugador 2"]);

  function startGame() {
    const list = playerNames.map(name => ({
      name,
      points: 0
    }));

    setPlayers(list);
    setBoard(buildBoard());
    setCurrentPlayer(0);
    setSelected([]);
    setScreen("playing");
  }


  function handleClick(r, c) {
    const card = board[r][c];

    if (card.faceUp || card.removed) return;
    if (selected.length === 2) return;

    const newBoard = board.map(row => row.map(c => ({ ...c })));
    newBoard[r][c].faceUp = true;

    const newSelected = [...selected, { r, c, card: newBoard[r][c] }];

    setBoard(newBoard);
    setSelected(newSelected);

    if (newSelected.length === 2) {
      setTimeout(() => resolveTurn(newSelected, newBoard), 1000);
    }
  }

  function resolveTurn(sel, newBoard) {
    const [a, b] = sel;

    if (a.card.matchKey === b.card.matchKey) {
      // MATCH
      newBoard[a.r][a.c].removed = true;
      newBoard[b.r][b.c].removed = true;

      setBoard(newBoard);

      setPlayers(prev => {
        const copy = [...prev];
        copy[currentPlayer] = {
          ...copy[currentPlayer],
          points: copy[currentPlayer].points + 1
        };
        return copy;
      });
    } else {
      // FAIL
      newBoard[a.r][a.c].faceUp = false;
      newBoard[b.r][b.c].faceUp = false;

      setBoard(newBoard);
      setCurrentPlayer((currentPlayer + 1) % players.length);
    }

    setSelected([]);
    const allGone = newBoard.flat().every(c => c.removed);

    if (allGone) {
      setTimeout(() => setScreen("gameover"), 800);
    }

  }

  const [board, setBoard] = useState(buildBoard);
  const [selected, setSelected] = useState([]); // cartas actualmente dadas vuelta
  const [players, setPlayers] = useState([]);

  const [currentPlayer, setCurrentPlayer] = useState(0);

  if (screen === "home") {
    return (
      <div className="home">
        <h1>MEMOTEST</h1>

        <label>Cantidad de jugadores</label>
        <select
          value={numPlayers}
          onChange={e => {
            const n = Number(e.target.value);
            setNumPlayers(n);
            setPlayerNames(Array(n).fill("").map((_, i) => `Jugador ${i+1}`));
          }}
        >
          {[2,3,4,5,6].map(n => (
            <option key={n} value={n}>{n}</option>
          ))}
        </select>

        {playerNames.map((name, i) => (
          <input
            key={i}
            value={name}
            onChange={e => {
              const copy = [...playerNames];
              copy[i] = e.target.value;
              setPlayerNames(copy);
            }}
            placeholder={`Jugador ${i+1}`}
          />
        ))}

        <button onClick={startGame}>JUGAR</button>
      </div>
    );
  }

  if (screen === "gameover") {
    const ranking = [...players].sort((a,b) => b.points - a.points);

    return (
      <div className="gameover">
        <h1>Resultado</h1>

        {ranking.map((p, i) => (
          <div key={i} className="podium">
            {i+1}. {p.name} — {p.points} puntos
          </div>
        ))}

        <button onClick={() => setScreen("home")}>Jugar otra vez</button>
      </div>
    );
  }

  return (
    <div className="game-root">
      {/* TABLERO */}
      <div className="board-area">

        <div className="board">
          {board.map((row, r) =>
            row.map((card, c) => (
              <div
                key={card.code}
                className={`card ${card.faceUp ? "flipped" : ""}`}
                onClick={() => handleClick(r, c)}
              >
                <div className="card-inner">
                  <div className="card-front">
                    <img src="/cards/reverso.png" className="card-img" alt="reverso" />
                  </div>
                  <div className="card-back">
                    <img
                      src={getCardImage(card.code)}
                      alt={card.code}
                      className="card-img"
                    />
                  </div>

                </div>
              </div>
            ))
          )}
        </div>
      </div>
      <div className="hud">
        <div className="turn">
          Turno: {players[currentPlayer].name}
        </div>
        <div className="scoreboard">
      {players.map((p,i)=>(
        <div key={i} className={i===currentPlayer?"active":""}>
          {p.name}: {p.points}
        </div>
      ))}
      </div>

      <button onClick={() => setScreen("home")}>Reiniciar</button>
    </div>
  </div>
  );
}
