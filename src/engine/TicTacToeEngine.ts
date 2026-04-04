export type Player = 'X' | 'O';
export type Cell = Player | null;
export type GameResult = Player | 'Draw' | null;

export interface MoveRecord {
  index: number;
  player: Player;
  board: Cell[];
}

// All eight winning lines: 3 rows, 3 columns, 2 diagonals
const WINNING_LINES: [number, number, number][] = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

/**
 * Checks all winning lines using a functional approach.
 * Returns the winning player if a line is complete, otherwise null.
 */
export function checkLines(board: Cell[]): Player | null {
  for (const [a, b, c] of WINNING_LINES) {
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return board[a] as Player;
    }
  }
  return null;
}

export class TicTacToeEngine {
  private board: Cell[];
  private currentPlayer: Player;
  private moveHistory: MoveRecord[];
  private gameOver: boolean;

  constructor() {
    this.board = Array(9).fill(null);
    this.currentPlayer = 'X';
    this.moveHistory = [];
    this.gameOver = false;
  }

  getBoard(): Cell[] {
    return [...this.board];
  }

  getCurrentPlayer(): Player {
    return this.currentPlayer;
  }

  getMoveHistory(): MoveRecord[] {
    return [...this.moveHistory];
  }

  isGameOver(): boolean {
    return this.gameOver;
  }

  /**
   * Attempts to play at the given index.
   * Returns false (and does NOT change state) if the move is illegal.
   * Returns true on success, then toggles the current player.
   * Throws a TypeError for out-of-range indices.
   */
  makeMove(index: number): boolean {
    if (index < 0 || index > 8) {
      throw new TypeError(`Index ${index} is out of range (0–8)`);
    }
    if (this.gameOver) {
      return false;
    }
    if (this.board[index] !== null) {
      return false;
    }

    this.board[index] = this.currentPlayer;
    this.moveHistory.push({
      index,
      player: this.currentPlayer,
      board: [...this.board],
    });

    if (this.checkWinner() !== null) {
      this.gameOver = true;
    } else {
      this.currentPlayer = this.currentPlayer === 'X' ? 'O' : 'X';
    }

    return true;
  }

  /**
   * Returns 'X', 'O', 'Draw', or null (game still in progress).
   * Draw is only declared when all cells are filled AND nobody won.
   */
  checkWinner(): GameResult {
    const winner = checkLines(this.board);
    if (winner) return winner;
    if (this.board.every((cell) => cell !== null)) return 'Draw';
    return null;
  }

  reset(): void {
    this.board = Array(9).fill(null);
    this.currentPlayer = 'X';
    this.moveHistory = [];
    this.gameOver = false;
  }

  /** Restore a previous state (used for time-travel / undo). */
  loadSnapshot(board: Cell[], currentPlayer: Player, history: MoveRecord[]): void {
    this.board = [...board];
    this.currentPlayer = currentPlayer;
    this.moveHistory = [...history];
    const result = this.checkWinner();
    this.gameOver = result !== null;
  }
}
