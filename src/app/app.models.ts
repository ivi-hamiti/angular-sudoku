export type Cell = number | undefined;

export type BoardCellState = 'highlighted' | 'marked' | 'selected';

export type BoardDifficulty = 'easy' | 'medium' | 'hard' | 'random';

export type BoardState = 'solved' | 'broken' | 'unsolvable';

export type BoardCell = Coordinate & {
  value: Cell;
  prefilled?: boolean;
  state?: BoardCellState;
};

export type Board = {
  groups: BoardGroup[];
  difficulty: BoardDifficulty;
};

export type BoardGroup = Coordinate & { cells: BoardCell[] };

export type Coordinate = { x: number; y: number };

export const same = (first: Coordinate, second: Coordinate): boolean => {
  return first.x === second.x && first.y === second.y;
};

export const sameRow = (first: Coordinate, second: Coordinate): boolean => {
  return first.y === second.y;
};

export const sameColumn = (first: Coordinate, second: Coordinate): boolean => {
  return first.x === second.x;
};
