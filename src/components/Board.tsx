import type { Cell, Player, GameResult } from '../engine';
import './Board.css';

interface BoardProps {
  board: Cell[];
  onCellClick: (index: number) => void;
  winnerCells: number[];
  disabled: boolean;
}

export function Board({ board, onCellClick, winnerCells, disabled }: BoardProps) {
  return (
    <div className="board" aria-label="Tic-Tac-Toe board">
      {board.map((cell, i) => (
        <button
          key={i}
          className={[
            'cell',
            cell ? `cell--${cell.toLowerCase()}` : '',
            winnerCells.includes(i) ? 'cell--winner' : '',
          ]
            .filter(Boolean)
            .join(' ')}
          onClick={() => onCellClick(i)}
          disabled={disabled || cell !== null}
          aria-label={`Cell ${i + 1}: ${cell ?? 'empty'}`}
        >
          {cell}
        </button>
      ))}
    </div>
  );
}

interface StatusBarProps {
  result: GameResult;
  currentPlayer: Player;
  vsAI: boolean;
}

export function StatusBar({ result, currentPlayer, vsAI }: StatusBarProps) {
  if (result === 'Draw') return <p className="status status--draw">It's a Draw! 🤝</p>;
  if (result === 'X') return <p className="status status--win">Player X wins! 🎉</p>;
  if (result === 'O')
    return <p className="status status--win">{vsAI ? 'AI (O) wins! 🤖' : 'Player O wins! 🎉'}</p>;
  return (
    <p className="status">
      {vsAI && currentPlayer === 'O' ? 'AI is thinking…' : `Player ${currentPlayer}'s turn`}
    </p>
  );
}
