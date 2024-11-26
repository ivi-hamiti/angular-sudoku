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
        [
          { value: undefined },
          { value: undefined },
          { value: undefined },
          { value: undefined },
          { value: undefined },
          { value: undefined },
          { value: undefined },
          { value: undefined },
          { value: undefined },
        ],
        [
          { value: undefined },
          { value: undefined },
          { value: undefined },
          { value: undefined },
          { value: undefined },
          { value: undefined },
          { value: undefined },
          { value: undefined },
          { value: undefined },
        ],
        [
          { value: undefined },
          { value: undefined },
          { value: undefined },
          { value: undefined },
          { value: undefined },
          { value: undefined },
          { value: undefined },
          { value: undefined },
          { value: undefined },
        ],
        [
          { value: undefined },
          { value: undefined },
          { value: undefined },
          { value: undefined },
          { value: undefined },
          { value: undefined },
          { value: undefined },
          { value: undefined },
          { value: undefined },
        ],
        [
          { value: undefined },
          { value: undefined },
          { value: undefined },
          { value: undefined },
          { value: undefined },
          { value: undefined },
          { value: undefined },
          { value: undefined },
          { value: undefined },
        ],
        [
          { value: undefined },
          { value: undefined },
          { value: undefined },
          { value: undefined },
          { value: undefined },
          { value: undefined },
          { value: undefined },
          { value: undefined },
          { value: undefined },
        ],
        [
          { value: undefined },
          { value: undefined },
          { value: undefined },
          { value: undefined },
          { value: undefined },
          { value: undefined },
          { value: undefined },
          { value: undefined },
          { value: undefined },
        ],
        [
          { value: undefined },
          { value: undefined },
          { value: undefined },
          { value: undefined },
          { value: undefined },
          { value: undefined },
          { value: undefined },
          { value: undefined },
          { value: undefined },
        ],
        [
          { value: undefined },
          { value: undefined },
          { value: undefined },
          { value: undefined },
          { value: undefined },
          { value: undefined },
          { value: undefined },
          { value: undefined },
          { value: undefined },
        ],
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
        [
          { value: 1, prefilled: true },
          { value: undefined },
          { value: undefined },
          { value: undefined },
          { value: undefined },
          { value: undefined },
          { value: 7, prefilled: true },
          { value: 8, prefilled: true },
          { value: undefined },
        ],
        [
          { value: undefined },
          { value: undefined },
          { value: undefined },
          { value: undefined },
          { value: 9, prefilled: true },
          { value: undefined },
          { value: undefined },
          { value: undefined },
          { value: undefined },
        ],
        [
          { value: undefined },
          { value: undefined },
          { value: undefined },
          { value: undefined },
          { value: 3, prefilled: true },
          { value: undefined },
          { value: 6, prefilled: true },
          { value: undefined },
          { value: undefined },
        ],
        [
          { value: undefined },
          { value: undefined },
          { value: undefined },
          { value: undefined },
          { value: undefined },
          { value: undefined },
          { value: undefined },
          { value: undefined },
          { value: undefined },
        ],
        [
          { value: undefined },
          { value: undefined },
          { value: undefined },
          { value: undefined },
          { value: undefined },
          { value: undefined },
          { value: undefined },
          { value: undefined },
          { value: undefined },
        ],
        [
          { value: undefined },
          { value: undefined },
          { value: undefined },
          { value: undefined },
          { value: undefined },
          { value: undefined },
          { value: undefined },
          { value: undefined },
          { value: undefined },
        ],
        [
          { value: undefined },
          { value: undefined },
          { value: undefined },
          { value: undefined },
          { value: undefined },
          { value: undefined },
          { value: undefined },
          { value: undefined },
          { value: undefined },
        ],
        [
          { value: undefined },
          { value: undefined },
          { value: undefined },
          { value: undefined },
          { value: undefined },
          { value: undefined },
          { value: undefined },
          { value: undefined },
          { value: undefined },
        ],
        [
          { value: undefined },
          { value: undefined },
          { value: undefined },
          { value: undefined },
          { value: undefined },
          { value: undefined },
          { value: undefined },
          { value: undefined },
          { value: undefined },
        ],
      ],
    });

    http.verify();
  });

  it('should solve the board', async () => {
    let solvedBoard = firstValueFrom(
      service.solve([
        [
          { value: 1, prefilled: true },
          { value: undefined },
          { value: undefined },
          { value: undefined },
          { value: undefined },
          { value: undefined },
          { value: 7, prefilled: true },
          { value: 8, prefilled: true },
          { value: undefined },
        ],
        [
          { value: undefined },
          { value: undefined },
          { value: undefined },
          { value: undefined },
          { value: 9, prefilled: true },
          { value: undefined },
          { value: undefined },
          { value: undefined },
          { value: undefined },
        ],
        [
          { value: undefined },
          { value: undefined },
          { value: undefined },
          { value: undefined },
          { value: 3, prefilled: true },
          { value: undefined },
          { value: 6, prefilled: true },
          { value: undefined },
          { value: undefined },
        ],
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
        [
          { value: 1, prefilled: true },
          { value: undefined },
          { value: undefined },
          { value: undefined },
          { value: undefined },
          { value: undefined },
          { value: 7, prefilled: true },
          { value: 8, prefilled: true },
          { value: undefined },
        ],
        [
          { value: undefined },
          { value: undefined },
          { value: undefined },
          { value: undefined },
          { value: 9, prefilled: true },
          { value: undefined },
          { value: undefined },
          { value: undefined },
          { value: undefined },
        ],
        [
          { value: undefined },
          { value: undefined },
          { value: undefined },
          { value: undefined },
          { value: 3, prefilled: true },
          { value: undefined },
          { value: 6, prefilled: true },
          { value: undefined },
          { value: undefined },
        ],
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
