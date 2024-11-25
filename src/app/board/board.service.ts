import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import {
  Board,
  BoardDifficulty,
  BoardGroup,
  BoardState,
  Coordinate,
} from '../app.models';

const endpoint = 'https://sugoku.onrender.com';

const square3x3: ReadonlyArray<Readonly<Coordinate>> = [
  { x: 0, y: 0 },
  { x: 1, y: 0 },
  { x: 2, y: 0 },
  { x: 0, y: 1 },
  { x: 1, y: 1 },
  { x: 2, y: 1 },
  { x: 0, y: 2 },
  { x: 1, y: 2 },
  { x: 2, y: 2 },
];

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
  console.log(difficulty, raw);
  const board: Board = {
    groups: [],
    difficulty,
  };

  square3x3.forEach((groupCoordinate) => {
    const group: BoardGroup = { ...groupCoordinate, cells: [] };

    square3x3.forEach((cellCoordinate) => {
      const y = groupCoordinate.y * 3 + cellCoordinate.y;
      const x = groupCoordinate.x * 3 + cellCoordinate.x;

      const value = raw[y][x];

      if (value === 0) {
        group.cells.push({ x, y, value: undefined });
      } else {
        group.cells.push({ x, y, value, prefilled: true });
      }
    });

    board.groups.push(group);
  });

  return board;
};

const serialize = (groups: BoardGroup[]): number[][] => {
  const rows: number[][] = [];

  groups.forEach((group) => {
    group.cells.forEach((cell) => {
      rows[cell.y] = rows[cell.y] || [];
      rows[cell.y][cell.x] = cell.value || 0;
    });
  });

  return rows;
};

@Injectable({
  providedIn: 'root',
})
export class BoardService {
  private readonly http = inject(HttpClient);

  empty = (): Board => {
    const groups: BoardGroup[] = [];

    square3x3.forEach((groupCoordinate) => {
      const group: BoardGroup = { ...groupCoordinate, cells: [] };

      square3x3.forEach((cellCoordinate) => {
        const y = groupCoordinate.y * 3 + cellCoordinate.y;
        const x = groupCoordinate.x * 3 + cellCoordinate.x;

        group.cells.push({ x, y, value: undefined });
      });

      groups.push(group);
    });

    return { groups, difficulty: 'random' };
  };

  generate = (difficulty: BoardDifficulty): Observable<Board> =>
    this.http
      .get<GenerateResponse>(`${endpoint}/board`, { params: { difficulty } })
      .pipe(map((response) => deserialize(difficulty, response.board)));

  solve = (groups: BoardGroup[]): Observable<SolveResult> =>
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

  validate = (groups: BoardGroup[]): Observable<BoardState> =>
    this.http
      .post<ValidateResponse>(`${endpoint}/validate`, {
        board: serialize(groups),
      })
      .pipe(map((response) => response.status));
}
