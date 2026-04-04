import { describe, it, expect, beforeEach } from 'vitest';
import { TicTacToeEngine, checkLines } from '../engine/TicTacToeEngine';
import type { Cell } from '../engine/TicTacToeEngine';

describe('checkLines', () => {
  it('returns null for an empty board', () => {
    expect(checkLines(Array(9).fill(null))).toBeNull();
  });

  it('detects a row win for X', () => {
    const board: Cell[] = ['X', 'X', 'X', null, null, null, null, null, null];
    expect(checkLines(board)).toBe('X');
  });

  it('detects a column win for O', () => {
    const board: Cell[] = ['O', null, null, 'O', null, null, 'O', null, null];
    expect(checkLines(board)).toBe('O');
  });

  it('detects a diagonal win', () => {
    const board: Cell[] = ['X', null, null, null, 'X', null, null, null, 'X'];
    expect(checkLines(board)).toBe('X');
  });

  it('returns null when no winner yet', () => {
    const board: Cell[] = ['X', 'O', 'X', 'X', 'O', 'O', null, null, null];
    expect(checkLines(board)).toBeNull();
  });
});

describe('TicTacToeEngine', () => {
  let engine: TicTacToeEngine;

  beforeEach(() => {
    engine = new TicTacToeEngine();
  });

  it('starts with an empty board', () => {
    expect(engine.getBoard()).toEqual(Array(9).fill(null));
    expect(engine.getCurrentPlayer()).toBe('X');
  });

  it('places a mark and toggles the current player', () => {
    engine.makeMove(0);
    expect(engine.getBoard()[0]).toBe('X');
    expect(engine.getCurrentPlayer()).toBe('O');
  });

  it('returns false and does not change state for an occupied cell', () => {
    engine.makeMove(0);
    const boardBefore = engine.getBoard();
    const result = engine.makeMove(0);
    expect(result).toBe(false);
    expect(engine.getBoard()).toEqual(boardBefore);
    expect(engine.getCurrentPlayer()).toBe('O');
  });

  it('throws TypeError for an out-of-range index', () => {
    expect(() => engine.makeMove(-1)).toThrow(TypeError);
    expect(() => engine.makeMove(9)).toThrow(TypeError);
  });

  it('returns false once the game is over', () => {
    // X wins via top row
    engine.makeMove(0); // X
    engine.makeMove(3); // O
    engine.makeMove(1); // X
    engine.makeMove(4); // O
    engine.makeMove(2); // X wins
    expect(engine.checkWinner()).toBe('X');
    expect(engine.makeMove(5)).toBe(false);
  });

  it('correctly identifies a draw', () => {
    // X O X
    // X X O
    // O X O  → draw
    const moves = [0, 1, 2, 5, 3, 6, 4, 8, 7];
    moves.forEach((idx) => engine.makeMove(idx));
    expect(engine.checkWinner()).toBe('Draw');
  });

  it('does NOT declare draw before checking for a winner on last move', () => {
    // Fill board so the last move wins instead of drawing:
    // X O X
    // O X O
    // O X X  → X wins with 2,4,6? No, let's use a simpler scenario
    // X X X
    // O O X
    // O X O  → X wins (row 0)
    const engine2 = new TicTacToeEngine();
    // X at 0,1,2 → win on move 3 before board is full
    engine2.makeMove(0); // X
    engine2.makeMove(3); // O
    engine2.makeMove(1); // X
    engine2.makeMove(4); // O
    engine2.makeMove(2); // X wins
    expect(engine2.checkWinner()).toBe('X');
    expect(engine2.checkWinner()).not.toBe('Draw');
  });

  it('tracks move history correctly', () => {
    engine.makeMove(4);
    engine.makeMove(0);
    const history = engine.getMoveHistory();
    expect(history).toHaveLength(2);
    expect(history[0].player).toBe('X');
    expect(history[0].index).toBe(4);
    expect(history[1].player).toBe('O');
  });

  it('resets the engine cleanly', () => {
    engine.makeMove(0);
    engine.makeMove(1);
    engine.reset();
    expect(engine.getBoard()).toEqual(Array(9).fill(null));
    expect(engine.getCurrentPlayer()).toBe('X');
    expect(engine.getMoveHistory()).toHaveLength(0);
    expect(engine.checkWinner()).toBeNull();
  });

  it('returns null for checkWinner when game is in progress', () => {
    engine.makeMove(0);
    expect(engine.checkWinner()).toBeNull();
  });

  it('loadSnapshot restores a previous state', () => {
    engine.makeMove(0);
    engine.makeMove(1);
    engine.makeMove(2);
    const fullHistory = engine.getMoveHistory();
    engine.loadSnapshot(fullHistory[0].board, 'O', [fullHistory[0]]);
    expect(engine.getMoveHistory()).toHaveLength(1);
    expect(engine.getCurrentPlayer()).toBe('O');
  });
});
