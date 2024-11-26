import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import {
  Board,
  BoardDifficulty,
  BoardCellGroup,
  BoardState,
  square3x3,
  fromSquare3x3,
} from '../app.models';

const endpoint = 'https://sugoku.onrender.com';

type GenerateResponse = {
  board: number[][];
};

type SolveResponse = {
  difficulty: BoardDifficulty;
  solution: number[][];
  status: BoardState;
};

type ValidateResponse = {
  status: BoardState;
};

export type SolveResult = {
  board: Board;
  state: BoardState;
};

const deserialize = (difficulty: BoardDifficulty, raw: number[][]): Board => {
  const board: Board = {
    groups: [],
    difficulty,
  };

  square3x3.forEach((_, groupIndex) => {
    const group: BoardCellGroup = [];

    const [groupRow, groupColumn] = fromSquare3x3(groupIndex);

    square3x3.forEach((_, cellIndex) => {
      const [cellRow, cellColumn] = fromSquare3x3(cellIndex);

      const row = groupRow * 3 + cellRow;
      const column = groupColumn * 3 + cellColumn;

      const value = raw[row][column];

      if (value === 0) {
        group.push({ value: undefined });
      } else {
        group.push({ value, prefilled: true });
      }
    });

    board.groups.push(group);
  });

  return board;
};

const serialize = (groups: BoardCellGroup[]): number[][] => {
  const rows: number[][] = [];

  groups.forEach((group, groupIndex) => {
    const [groupRow, groupColumn] = fromSquare3x3(groupIndex);

    group.forEach((cell, cellIndex) => {
      const [cellRow, cellColumn] = fromSquare3x3(cellIndex);

      const row = groupRow * 3 + cellRow;
      const column = groupColumn * 3 + cellColumn;

      rows[row] ??= [];
      rows[row][column] = cell.value || 0;
    });
  });

  return rows;
};

@Injectable({
  providedIn: 'root',
})
export class BoardService {
  private readonly http = inject(HttpClient);

  empty = (): Board =>
    deserialize('random', [
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
    ]);

  generate = (difficulty: BoardDifficulty): Observable<Board> =>
    this.http
      .get<GenerateResponse>(`${endpoint}/board`, { params: { difficulty } })
      .pipe(map((response) => deserialize(difficulty, response.board)));

  solve = (groups: BoardCellGroup[]): Observable<SolveResult> =>
    this.http
      .post<SolveResponse>(`${endpoint}/solve`, {
        board: serialize(groups),
      })
      .pipe(
        map((response) => ({
          state: response.status,
          board: deserialize(response.difficulty, response.solution),
        }))
      );

  validate = (groups: BoardCellGroup[]): Observable<BoardState> =>
    this.http
      .post<ValidateResponse>(`${endpoint}/validate`, {
        board: serialize(groups),
      })
      .pipe(map((response) => response.status));
}
