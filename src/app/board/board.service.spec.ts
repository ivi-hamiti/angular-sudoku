import { TestBed } from '@angular/core/testing';

import { provideHttpClient } from '@angular/common/http';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { firstValueFrom } from 'rxjs';
import { BoardService } from './board.service';

describe('BoardService', () => {
  let service: BoardService;
  let http: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });

    service = TestBed.inject(BoardService);
    http = TestBed.inject(HttpTestingController);
  });

  it('should generate an empty board', async () => {
    let generatedBoard = service.empty();

    expect(generatedBoard).toEqual({
      difficulty: 'random',
      groups: [
        {
          x: 0,
          y: 0,
          cells: [
            { x: 0, y: 0, value: undefined },
            { x: 1, y: 0, value: undefined },
            { x: 2, y: 0, value: undefined },
            { x: 0, y: 1, value: undefined },
            { x: 1, y: 1, value: undefined },
            { x: 2, y: 1, value: undefined },
            { x: 0, y: 2, value: undefined },
            { x: 1, y: 2, value: undefined },
            { x: 2, y: 2, value: undefined },
          ],
        },
        {
          x: 1,
          y: 0,
          cells: [
            { x: 3, y: 0, value: undefined },
            { x: 4, y: 0, value: undefined },
            { x: 5, y: 0, value: undefined },
            { x: 3, y: 1, value: undefined },
            { x: 4, y: 1, value: undefined },
            { x: 5, y: 1, value: undefined },
            { x: 3, y: 2, value: undefined },
            { x: 4, y: 2, value: undefined },
            { x: 5, y: 2, value: undefined },
          ],
        },
        {
          x: 2,
          y: 0,
          cells: [
            { x: 6, y: 0, value: undefined },
            { x: 7, y: 0, value: undefined },
            { x: 8, y: 0, value: undefined },
            { x: 6, y: 1, value: undefined },
            { x: 7, y: 1, value: undefined },
            { x: 8, y: 1, value: undefined },
            { x: 6, y: 2, value: undefined },
            { x: 7, y: 2, value: undefined },
            { x: 8, y: 2, value: undefined },
          ],
        },
        {
          x: 0,
          y: 1,
          cells: [
            { x: 0, y: 3, value: undefined },
            { x: 1, y: 3, value: undefined },
            { x: 2, y: 3, value: undefined },
            { x: 0, y: 4, value: undefined },
            { x: 1, y: 4, value: undefined },
            { x: 2, y: 4, value: undefined },
            { x: 0, y: 5, value: undefined },
            { x: 1, y: 5, value: undefined },
            { x: 2, y: 5, value: undefined },
          ],
        },
        {
          x: 1,
          y: 1,
          cells: [
            { x: 3, y: 3, value: undefined },
            { x: 4, y: 3, value: undefined },
            { x: 5, y: 3, value: undefined },
            { x: 3, y: 4, value: undefined },
            { x: 4, y: 4, value: undefined },
            { x: 5, y: 4, value: undefined },
            { x: 3, y: 5, value: undefined },
            { x: 4, y: 5, value: undefined },
            { x: 5, y: 5, value: undefined },
          ],
        },
        {
          x: 2,
          y: 1,
          cells: [
            { x: 6, y: 3, value: undefined },
            { x: 7, y: 3, value: undefined },
            { x: 8, y: 3, value: undefined },
            { x: 6, y: 4, value: undefined },
            { x: 7, y: 4, value: undefined },
            { x: 8, y: 4, value: undefined },
            { x: 6, y: 5, value: undefined },
            { x: 7, y: 5, value: undefined },
            { x: 8, y: 5, value: undefined },
          ],
        },
        {
          x: 0,
          y: 2,
          cells: [
            { x: 0, y: 6, value: undefined },
            { x: 1, y: 6, value: undefined },
            { x: 2, y: 6, value: undefined },
            { x: 0, y: 7, value: undefined },
            { x: 1, y: 7, value: undefined },
            { x: 2, y: 7, value: undefined },
            { x: 0, y: 8, value: undefined },
            { x: 1, y: 8, value: undefined },
            { x: 2, y: 8, value: undefined },
          ],
        },
        {
          x: 1,
          y: 2,
          cells: [
            { x: 3, y: 6, value: undefined },
            { x: 4, y: 6, value: undefined },
            { x: 5, y: 6, value: undefined },
            { x: 3, y: 7, value: undefined },
            { x: 4, y: 7, value: undefined },
            { x: 5, y: 7, value: undefined },
            { x: 3, y: 8, value: undefined },
            { x: 4, y: 8, value: undefined },
            { x: 5, y: 8, value: undefined },
          ],
        },
        {
          x: 2,
          y: 2,
          cells: [
            { x: 6, y: 6, value: undefined },
            { x: 7, y: 6, value: undefined },
            { x: 8, y: 6, value: undefined },
            { x: 6, y: 7, value: undefined },
            { x: 7, y: 7, value: undefined },
            { x: 8, y: 7, value: undefined },
            { x: 6, y: 8, value: undefined },
            { x: 7, y: 8, value: undefined },
            { x: 8, y: 8, value: undefined },
          ],
        },
      ],
    });

    http.verify();
  });

  it('should generate a board with the given difficulty', async () => {
    let generatedBoard = firstValueFrom(service.generate('easy'));

    let request = http.expectOne(
      'https://sugoku.onrender.com/board?difficulty=easy'
    );

    expect(request.request.method).toBe('GET');

    request.flush({
      board: [
        [1, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 9, 0, 0, 3, 0],
        [7, 8, 0, 0, 0, 0, 6, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
      ],
    });

    expect(await generatedBoard).toEqual({
      difficulty: 'easy',
      groups: [
        {
          x: 0,
          y: 0,
          cells: [
            { x: 0, y: 0, value: 1, prefilled: true },
            { x: 1, y: 0, value: undefined },
            { x: 2, y: 0, value: undefined },
            { x: 0, y: 1, value: undefined },
            { x: 1, y: 1, value: undefined },
            { x: 2, y: 1, value: undefined },
            { x: 0, y: 2, value: 7, prefilled: true },
            { x: 1, y: 2, value: 8, prefilled: true },
            { x: 2, y: 2, value: undefined },
          ],
        },
        {
          x: 1,
          y: 0,
          cells: [
            { x: 3, y: 0, value: undefined },
            { x: 4, y: 0, value: undefined },
            { x: 5, y: 0, value: undefined },
            { x: 3, y: 1, value: undefined },
            { x: 4, y: 1, value: 9, prefilled: true },
            { x: 5, y: 1, value: undefined },
            { x: 3, y: 2, value: undefined },
            { x: 4, y: 2, value: undefined },
            { x: 5, y: 2, value: undefined },
          ],
        },
        {
          x: 2,
          y: 0,
          cells: [
            { x: 6, y: 0, value: undefined },
            { x: 7, y: 0, value: undefined },
            { x: 8, y: 0, value: undefined },
            { x: 6, y: 1, value: undefined },
            { x: 7, y: 1, value: 3, prefilled: true },
            { x: 8, y: 1, value: undefined },
            { x: 6, y: 2, value: 6, prefilled: true },
            { x: 7, y: 2, value: undefined },
            { x: 8, y: 2, value: undefined },
          ],
        },
        {
          x: 0,
          y: 1,
          cells: [
            { x: 0, y: 3, value: undefined },
            { x: 1, y: 3, value: undefined },
            { x: 2, y: 3, value: undefined },
            { x: 0, y: 4, value: undefined },
            { x: 1, y: 4, value: undefined },
            { x: 2, y: 4, value: undefined },
            { x: 0, y: 5, value: undefined },
            { x: 1, y: 5, value: undefined },
            { x: 2, y: 5, value: undefined },
          ],
        },
        {
          x: 1,
          y: 1,
          cells: [
            { x: 3, y: 3, value: undefined },
            { x: 4, y: 3, value: undefined },
            { x: 5, y: 3, value: undefined },
            { x: 3, y: 4, value: undefined },
            { x: 4, y: 4, value: undefined },
            { x: 5, y: 4, value: undefined },
            { x: 3, y: 5, value: undefined },
            { x: 4, y: 5, value: undefined },
            { x: 5, y: 5, value: undefined },
          ],
        },
        {
          x: 2,
          y: 1,
          cells: [
            { x: 6, y: 3, value: undefined },
            { x: 7, y: 3, value: undefined },
            { x: 8, y: 3, value: undefined },
            { x: 6, y: 4, value: undefined },
            { x: 7, y: 4, value: undefined },
            { x: 8, y: 4, value: undefined },
            { x: 6, y: 5, value: undefined },
            { x: 7, y: 5, value: undefined },
            { x: 8, y: 5, value: undefined },
          ],
        },
        {
          x: 0,
          y: 2,
          cells: [
            { x: 0, y: 6, value: undefined },
            { x: 1, y: 6, value: undefined },
            { x: 2, y: 6, value: undefined },
            { x: 0, y: 7, value: undefined },
            { x: 1, y: 7, value: undefined },
            { x: 2, y: 7, value: undefined },
            { x: 0, y: 8, value: undefined },
            { x: 1, y: 8, value: undefined },
            { x: 2, y: 8, value: undefined },
          ],
        },
        {
          x: 1,
          y: 2,
          cells: [
            { x: 3, y: 6, value: undefined },
            { x: 4, y: 6, value: undefined },
            { x: 5, y: 6, value: undefined },
            { x: 3, y: 7, value: undefined },
            { x: 4, y: 7, value: undefined },
            { x: 5, y: 7, value: undefined },
            { x: 3, y: 8, value: undefined },
            { x: 4, y: 8, value: undefined },
            { x: 5, y: 8, value: undefined },
          ],
        },
        {
          x: 2,
          y: 2,
          cells: [
            { x: 6, y: 6, value: undefined },
            { x: 7, y: 6, value: undefined },
            { x: 8, y: 6, value: undefined },
            { x: 6, y: 7, value: undefined },
            { x: 7, y: 7, value: undefined },
            { x: 8, y: 7, value: undefined },
            { x: 6, y: 8, value: undefined },
            { x: 7, y: 8, value: undefined },
            { x: 8, y: 8, value: undefined },
          ],
        },
      ],
    });

    http.verify();
  });

  it('should solve the board', async () => {
    let solvedBoard = firstValueFrom(
      service.solve([
        {
          x: 0,
          y: 0,
          cells: [
            { x: 0, y: 0, value: 1, prefilled: true },
            { x: 1, y: 0, value: undefined },
            { x: 2, y: 0, value: undefined },
            { x: 0, y: 1, value: undefined },
            { x: 1, y: 1, value: undefined },
            { x: 2, y: 1, value: undefined },
            { x: 0, y: 2, value: 7, prefilled: true },
            { x: 1, y: 2, value: 8, prefilled: true },
            { x: 2, y: 2, value: undefined },
          ],
        },
        {
          x: 1,
          y: 0,
          cells: [
            { x: 3, y: 0, value: undefined },
            { x: 4, y: 0, value: undefined },
            { x: 5, y: 0, value: undefined },
            { x: 3, y: 1, value: undefined },
            { x: 4, y: 1, value: 9, prefilled: true },
            { x: 5, y: 1, value: undefined },
            { x: 3, y: 2, value: undefined },
            { x: 4, y: 2, value: undefined },
            { x: 5, y: 2, value: undefined },
          ],
        },
        {
          x: 2,
          y: 0,
          cells: [
            { x: 6, y: 0, value: undefined },
            { x: 7, y: 0, value: undefined },
            { x: 8, y: 0, value: undefined },
            { x: 6, y: 1, value: undefined },
            { x: 7, y: 1, value: 3, prefilled: true },
            { x: 8, y: 1, value: undefined },
            { x: 6, y: 2, value: 6, prefilled: true },
            { x: 7, y: 2, value: undefined },
            { x: 8, y: 2, value: undefined },
          ],
        },
      ])
    );

    let request = http.expectOne('https://sugoku.onrender.com/solve');

    expect(request.request.method).toBe('POST');
    expect(request.request.body).toEqual({
      board: [
        [1, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 9, 0, 0, 3, 0],
        [7, 8, 0, 0, 0, 0, 6, 0, 0],
      ],
    });

    request.flush({
      status: 'solved',
      difficulty: 'easy',
      solution: [[], [], [], [], [], [], [], [], []],
    });

    expect(await solvedBoard).toEqual({
      state: 'solved',
      board: jasmine.objectContaining({
        difficulty: 'easy',
      }),
    });

    http.verify();
  });

  it('should validate the board', async () => {
    let validateState = firstValueFrom(
      service.validate([
        {
          x: 0,
          y: 0,
          cells: [
            { x: 0, y: 0, value: 1, prefilled: true },
            { x: 1, y: 0, value: undefined },
            { x: 2, y: 0, value: undefined },
            { x: 0, y: 1, value: undefined },
            { x: 1, y: 1, value: undefined },
            { x: 2, y: 1, value: undefined },
            { x: 0, y: 2, value: 7, prefilled: true },
            { x: 1, y: 2, value: 8, prefilled: true },
            { x: 2, y: 2, value: undefined },
          ],
        },
        {
          x: 1,
          y: 0,
          cells: [
            { x: 3, y: 0, value: undefined },
            { x: 4, y: 0, value: undefined },
            { x: 5, y: 0, value: undefined },
            { x: 3, y: 1, value: undefined },
            { x: 4, y: 1, value: 9, prefilled: true },
            { x: 5, y: 1, value: undefined },
            { x: 3, y: 2, value: undefined },
            { x: 4, y: 2, value: undefined },
            { x: 5, y: 2, value: undefined },
          ],
        },
        {
          x: 2,
          y: 0,
          cells: [
            { x: 6, y: 0, value: undefined },
            { x: 7, y: 0, value: undefined },
            { x: 8, y: 0, value: undefined },
            { x: 6, y: 1, value: undefined },
            { x: 7, y: 1, value: 3, prefilled: true },
            { x: 8, y: 1, value: undefined },
            { x: 6, y: 2, value: 6, prefilled: true },
            { x: 7, y: 2, value: undefined },
            { x: 8, y: 2, value: undefined },
          ],
        },
      ])
    );

    let request = http.expectOne('https://sugoku.onrender.com/validate');

    expect(request.request.method).toBe('POST');
    expect(request.request.body).toEqual({
      board: [
        [1, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 9, 0, 0, 3, 0],
        [7, 8, 0, 0, 0, 0, 6, 0, 0],
      ],
    });

    request.flush({
      status: 'unsolved',
    });

    expect(await validateState).toEqual('unsolved');

    http.verify();
  });
});
