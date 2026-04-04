import { describe, it, expect } from 'vitest';
import { getBestMove } from '../engine/ai';
import type { Cell } from '../engine/TicTacToeEngine';

describe('getBestMove (hard difficulty)', () => {
  it('takes the winning move immediately', () => {
    // O can win at index 2
    const board: Cell[] = ['O', 'O', null, 'X', 'X', null, null, null, null];
    expect(getBestMove(board, 'O', 'hard')).toBe(2);
  });

  it('blocks the human from winning', () => {
    // X can win at index 2; AI should block it
    const board: Cell[] = ['X', 'X', null, 'O', null, null, null, null, null];
    expect(getBestMove(board, 'O', 'hard')).toBe(2);
  });

  it('returns a valid index on an empty board', () => {
    const board: Cell[] = Array(9).fill(null);
    const move = getBestMove(board, 'O', 'hard');
    expect(move).toBeGreaterThanOrEqual(0);
    expect(move).toBeLessThanOrEqual(8);
    expect(board[move]).toBeNull();
  });

  it('returns a valid index', () => {
    const board: Cell[] = ['X', null, 'O', null, 'X', null, null, 'O', null];
    const move = getBestMove(board, 'O', 'hard');
    expect(move).toBeGreaterThanOrEqual(0);
    expect(move).toBeLessThanOrEqual(8);
    expect(board[move]).toBeNull();
  });

  it('throws when no moves are available', () => {
    const board: Cell[] = ['X', 'O', 'X', 'O', 'X', 'O', 'O', 'X', 'O'];
    expect(() => getBestMove(board, 'X', 'hard')).toThrow();
  });
});

describe('getBestMove (easy difficulty)', () => {
  it('returns a valid index for easy difficulty', () => {
    const board: Cell[] = Array(9).fill(null);
    const move = getBestMove(board, 'O', 'easy');
    expect(move).toBeGreaterThanOrEqual(0);
    expect(move).toBeLessThanOrEqual(8);
    expect(board[move]).toBeNull();
  });
});

describe('getBestMove (medium difficulty)', () => {
  it('returns a valid index for medium difficulty', () => {
    const board: Cell[] = ['X', null, null, null, null, null, null, null, null];
    const move = getBestMove(board, 'O', 'medium');
    expect(move).toBeGreaterThanOrEqual(0);
    expect(move).toBeLessThanOrEqual(8);
    expect(board[move]).toBeNull();
  });
});
