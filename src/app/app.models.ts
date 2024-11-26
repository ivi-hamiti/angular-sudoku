export type Cell = number | undefined;

export type BoardCellState = 'highlighted' | 'marked' | 'selected';

export type BoardDifficulty = 'easy' | 'medium' | 'hard' | 'random';

export type BoardState = 'solved' | 'broken' | 'unsolvable';

export type BoardCell = {
  value: Cell;
  prefilled?: boolean;
  state?: BoardCellState;
};

export type Board = {
  groups: BoardCellGroup[];
  difficulty: BoardDifficulty;
};

export type BoardCellGroup = BoardCell[];

export const square3x3: ReadonlyArray<undefined> = Array.from({ length: 9 });

export const fromSquare3x3 = (index: number): [number, number] => {
  const row = Math.floor(index / 3);
  const column = index % 3;

  return [row, column];
};
