import type { MoveRecord } from '../engine';
import './MoveHistory.css';

interface MoveHistoryProps {
  history: MoveRecord[];
  onTimeTravel: (stepIndex: number) => void;
  currentStep: number;
}

export function MoveHistory({ history, onTimeTravel, currentStep }: MoveHistoryProps) {
  return (
    <aside className="history">
      <h2 className="history__title">Move History</h2>
      <ul className="history__list">
        <li>
          <button
            className={`history__btn ${currentStep === -1 ? 'history__btn--active' : ''}`}
            onClick={() => onTimeTravel(-1)}
          >
            ⬜ Game start
          </button>
        </li>
        {history.map((move, i) => (
          <li key={i}>
            <button
              className={`history__btn ${currentStep === i ? 'history__btn--active' : ''}`}
              onClick={() => onTimeTravel(i)}
            >
              #{i + 1} — {move.player} → cell {move.index + 1}
            </button>
          </li>
        ))}
      </ul>
    </aside>
  );
}
