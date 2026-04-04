import { useCallback, useEffect, useRef, useState } from 'react';
import { TicTacToeEngine, getBestMove, checkLines } from './engine';
import type { Cell, GameResult, MoveRecord, Player } from './engine';
import type { Difficulty } from './engine';
import { Board, StatusBar } from './components/Board';
import { MoveHistory } from './components/MoveHistory';
import './App.css';

// Determine which cells form the winning line so we can highlight them
function getWinnerCells(board: Cell[]): number[] {
  const WINNING_LINES: [number, number, number][] = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8],
    [0, 3, 6], [1, 4, 7], [2, 5, 8],
    [0, 4, 8], [2, 4, 6],
  ];
  for (const line of WINNING_LINES) {
    const [a, b, c] = line;
    if (board[a] && board[a] === board[b] && board[a] === board[c]) return line;
  }
  return [];
}

export default function App() {
  const engineRef = useRef(new TicTacToeEngine());

  const [board, setBoard] = useState<Cell[]>(Array(9).fill(null));
  const [currentPlayer, setCurrentPlayer] = useState<Player>('X');
  const [result, setResult] = useState<GameResult>(null);
  const [history, setHistory] = useState<MoveRecord[]>([]);
  const [currentStep, setCurrentStep] = useState<number>(-1);

  const [vsAI, setVsAI] = useState(false);
  const [difficulty, setDifficulty] = useState<Difficulty>('hard');
  const [aiThinking, setAiThinking] = useState(false);

  const syncState = useCallback(() => {
    const eng = engineRef.current;
    setBoard(eng.getBoard());
    setCurrentPlayer(eng.getCurrentPlayer());
    setResult(eng.checkWinner());
    setHistory(eng.getMoveHistory());
    setCurrentStep(eng.getMoveHistory().length - 1);
  }, []);

  const handleCellClick = useCallback(
    (index: number) => {
      const eng = engineRef.current;
      if (aiThinking) return;
      const success = eng.makeMove(index);
      if (!success) return;
      syncState();
    },
    [aiThinking, syncState],
  );

  // Trigger AI move after human's turn when vsAI is on
  useEffect(() => {
    if (!vsAI) return;
    const eng = engineRef.current;
    if (eng.checkWinner() !== null) return;
    if (eng.getCurrentPlayer() !== 'O') return;

    const timer = setTimeout(() => {
      setAiThinking(true);
      const boardCopy = eng.getBoard();
      const move = getBestMove(boardCopy, 'O', difficulty);
      eng.makeMove(move);
      syncState();
      setAiThinking(false);
    }, 400);

    return () => clearTimeout(timer);
  }, [board, vsAI, difficulty, syncState]);

  const handleReset = useCallback(() => {
    engineRef.current.reset();
    setAiThinking(false);
    syncState();
  }, [syncState]);

  const handleTimeTravel = useCallback(
    (stepIndex: number) => {
      const eng = engineRef.current;
      const fullHistory = eng.getMoveHistory();

      if (stepIndex === -1) {
        eng.loadSnapshot(Array(9).fill(null), 'X', []);
      } else {
        const snapshot = fullHistory[stepIndex];
        const slicedHistory = fullHistory.slice(0, stepIndex + 1);
        const nextPlayer: Player = snapshot.player === 'X' ? 'O' : 'X';
        const winner = checkLines(snapshot.board);
        eng.loadSnapshot(
          snapshot.board,
          winner ? snapshot.player : nextPlayer,
          slicedHistory,
        );
      }
      syncState();
      setCurrentStep(stepIndex);
    },
    [syncState],
  );

  const winnerCells = getWinnerCells(board);
  const boardDisabled = result !== null || aiThinking || (vsAI && currentPlayer === 'O');

  return (
    <div className="app">
      <header className="app__header">
        <h1 className="app__title">Tic‑Tac‑Toe</h1>
        <div className="app__controls">
          <label className="control-label">
            <input
              type="checkbox"
              checked={vsAI}
              onChange={(e) => {
                setVsAI(e.target.checked);
                handleReset();
              }}
            />
            &nbsp;Play vs AI
          </label>
          {vsAI && (
            <select
              className="control-select"
              value={difficulty}
              onChange={(e) => {
                setDifficulty(e.target.value as Difficulty);
                handleReset();
              }}
              aria-label="AI difficulty"
            >
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard (Unbeatable)</option>
            </select>
          )}
        </div>
      </header>

      <div className="app__content">
        <main className="app__main">
          <StatusBar result={result} currentPlayer={currentPlayer} vsAI={vsAI} />
          <Board
            board={board}
            onCellClick={handleCellClick}
            winnerCells={winnerCells}
            disabled={boardDisabled}
          />
          <button className="btn-reset" onClick={handleReset}>
            Play Again
          </button>
        </main>

        <MoveHistory
          history={history}
          onTimeTravel={handleTimeTravel}
          currentStep={currentStep}
        />
      </div>
    </div>
  );
}

