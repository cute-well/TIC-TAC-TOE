import type { Cell, Player } from './TicTacToeEngine';
import { checkLines } from './TicTacToeEngine';

export type Difficulty = 'easy' | 'medium' | 'hard';

const EMPTY_INDICES = (board: Cell[]) =>
  board.reduce<number[]>((acc, cell, i) => (cell === null ? [...acc, i] : acc), []);

/**
 * Minimax with alpha-beta pruning.
 * Returns a score from the AI's perspective (positive = AI winning).
 *
 *   +10 − depth  →  AI (maximiser) wins fast
 *   −10 + depth  →  Human (minimiser) wins fast
 *        0       →  Draw
 *
 * @param board   Current board state
 * @param depth   Recursion depth (used to prefer shorter wins)
 * @param isMaximising  true when it's the AI's turn
 * @param aiPlayer  Which mark the AI is playing
 * @param alpha   Alpha for pruning
 * @param beta    Beta for pruning
 */
function minimax(
  board: Cell[],
  depth: number,
  isMaximising: boolean,
  aiPlayer: Player,
  alpha: number,
  beta: number,
): number {
  const humanPlayer: Player = aiPlayer === 'X' ? 'O' : 'X';
  const winner = checkLines(board);

  if (winner === aiPlayer) return 10 - depth;
  if (winner === humanPlayer) return depth - 10;
  if (board.every((c) => c !== null)) return 0;

  const empty = EMPTY_INDICES(board);

  if (isMaximising) {
    let best = -Infinity;
    for (const i of empty) {
      board[i] = aiPlayer;
      best = Math.max(best, minimax(board, depth + 1, false, aiPlayer, alpha, beta));
      board[i] = null;
      alpha = Math.max(alpha, best);
      if (beta <= alpha) break;
    }
    return best;
  } else {
    let best = Infinity;
    for (const i of empty) {
      board[i] = humanPlayer;
      best = Math.min(best, minimax(board, depth + 1, true, aiPlayer, alpha, beta));
      board[i] = null;
      beta = Math.min(beta, best);
      if (beta <= alpha) break;
    }
    return best;
  }
}

/**
 * Returns the best move index for the AI player.
 *
 * Difficulty levels:
 *   hard   – pure Minimax (unbeatable)
 *   medium – 70 % best move, 30 % random available cell
 *   easy   – 30 % best move, 70 % random available cell
 */
export function getBestMove(board: Cell[], aiPlayer: Player, difficulty: Difficulty = 'hard'): number {
  const empty = EMPTY_INDICES(board);
  if (empty.length === 0) throw new Error('No moves available');

  // Inject randomness for easier difficulties
  const randomThreshold = difficulty === 'hard' ? 0 : difficulty === 'medium' ? 0.3 : 0.7;
  if (Math.random() < randomThreshold) {
    return empty[Math.floor(Math.random() * empty.length)];
  }

  let bestScore = -Infinity;
  let bestMove = empty[0];

  for (const i of empty) {
    board[i] = aiPlayer;
    const score = minimax(board, 0, false, aiPlayer, -Infinity, Infinity);
    board[i] = null;
    if (score > bestScore) {
      bestScore = score;
      bestMove = i;
    }
  }

  return bestMove;
}
