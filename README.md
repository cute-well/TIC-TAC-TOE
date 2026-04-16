# TIC-TAC-TOE

A modern Tic-Tac-Toe game built with **React + TypeScript + Vite**.

## Features

- Classic 3×3 Tic-Tac-Toe gameplay
- Play **Player vs Player** or **Player vs AI**
- AI difficulty modes:
  - `easy` (more random)
  - `medium` (balanced)
  - `hard` (minimax, unbeatable)
- Move history with **time travel** (jump to any previous move)
- Winning-line highlighting
- Clear game status and reset flow

## Tech Stack

- React 19
- TypeScript
- Vite
- Vitest + Testing Library
- ESLint

## Getting Started

### 1) Install dependencies

```bash
npm ci
```

### 2) Run in development

```bash
npm run dev
```

### 3) Build for production

```bash
npm run build
```

### 4) Preview production build

```bash
npm run preview
```

## Scripts

- `npm run dev` — start development server
- `npm run build` — type-check and build production bundle
- `npm run preview` — preview built app
- `npm run lint` — run ESLint
- `npm test` — run test suite once
- `npm run test:watch` — run tests in watch mode
- `npm run test:coverage` — run tests with coverage

## Project Structure

```text
src/
  components/
    Board.tsx
    MoveHistory.tsx
  engine/
    TicTacToeEngine.ts
    ai.ts
  test/
    engine.test.ts
    ai.test.ts
  App.tsx
  main.tsx
```

## Game Logic Overview

- `TicTacToeEngine` handles:
  - board state
  - player turns
  - winner/draw detection
  - move validation
  - reset and snapshot loading for time travel
- `ai.ts` provides minimax-based move selection with difficulty-based randomness.

## Testing

The project includes automated tests for:

- core engine behavior (moves, winner checks, draw, reset, history)
- AI move selection and validity across difficulties

Run:

```bash
npm test
```

## License

This repository does not currently specify a license.
