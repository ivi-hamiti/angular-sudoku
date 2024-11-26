import { BreakpointObserver, BreakpointState } from '@angular/cdk/layout';
import { Component, input, output } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatSnackBar } from '@angular/material/snack-bar';
import { By } from '@angular/platform-browser';
import { BehaviorSubject, of, Subject } from 'rxjs';
import { AppComponent } from './app.component';
import { BoardCellGroup, BoardDifficulty } from './app.models';
import { BoardSelectedEvent } from './board/board.component';
import { BoardService } from './board/board.service';
import { MenuService } from './menu/menu.service';

@Component({
  selector: 'app-header',
  template: '',
})
class MockHeaderComponent {}

@Component({
  selector: 'app-menu',
  template: '',
})
class MockMenuComponent {
  difficulty = input.required<BoardDifficulty>();
  new = output<BoardDifficulty>();
  solve = output();
  check = output();
}

@Component({
  selector: 'app-board',
  template: '',
})
class MockBoardComponent {
  select = output<BoardSelectedEvent>();
  groups = input.required<BoardCellGroup[]>();
}

@Component({
  selector: 'app-keypad',
  template: '',
})
class MockKeypadComponent {
  press = output<number>();
  layout = input<'row' | 'grid'>('row');
}

describe('AppComponent', () => {
  let boardService: Mock<BoardService>;
  let snackbarService: Mock<MatSnackBar>;

  let menuService: Mock<MenuService> & {
    resolveDifficulty: (difficulty: BoardDifficulty) => void;
  };

  let breakpointService: Mock<BreakpointObserver> & {
    resolveBreakpoint: (matches: boolean) => void;
  };

  const getComponents = (fixture: ComponentFixture<AppComponent>) => ({
    header: fixture.debugElement.query(By.css('app-header')),
    menu: fixture.debugElement.query(By.css('app-menu')),
    board: fixture.debugElement.query(By.css('app-board')),
    keypad: fixture.debugElement.query(By.css('app-keypad')),
  });

  beforeEach(async () => {
    boardService = {
      empty: jasmine.createSpy('empty').and.returnValue({
        difficulty: 'random',
        groups: [
          [{ value: undefined }, { value: undefined }],
          [{ value: undefined }, { value: undefined }],
        ],
      }),
      generate: jasmine.createSpy('generate'),
      solve: jasmine.createSpy('solve'),
      validate: jasmine.createSpy('validate'),
    };

    const menuServiceSubject = new Subject<BoardDifficulty>();
    menuService = {
      resolveDifficulty: (difficulty: BoardDifficulty) => {
        menuServiceSubject.next(difficulty);
        menuServiceSubject.complete;
      },
      openDifficultyChooser: jasmine
        .createSpy('openDifficultyChooser')
        .and.returnValue({
          afterClosed: jasmine
            .createSpy('afterClosed')
            .and.returnValue(menuServiceSubject),
        }),
    };

    const breakpointServiceSubject = new BehaviorSubject<BreakpointState>({
      matches: true,
      breakpoints: {},
    });

    breakpointService = {
      ngOnDestroy: jasmine.createSpy('ngOnDestroy'),
      isMatched: jasmine.createSpy('isMatched').and.returnValue(false),
      observe: jasmine
        .createSpy('observe')
        .and.returnValue(breakpointServiceSubject),
      resolveBreakpoint: (matches: boolean) =>
        breakpointServiceSubject.next({
          matches,
          breakpoints: {},
        }),
    };

    snackbarService = {
      open: jasmine.createSpy('open'),
      ngOnDestroy: jasmine.createSpy('ngOnDestroy'),
      openFromComponent: jasmine.createSpy('openFromComponent'),
      openFromTemplate: jasmine.createSpy('openFromTemplate'),
      dismiss: jasmine.createSpy('dismiss'),
    };

    await TestBed.configureTestingModule({
      imports: [
        AppComponent,
        MockBoardComponent,
        MockHeaderComponent,
        MockKeypadComponent,
        MockMenuComponent,
      ],
    })
      .overrideProvider(BoardService, { useValue: boardService })
      .overrideProvider(MenuService, { useValue: menuService })
      .overrideProvider(BreakpointObserver, { useValue: breakpointService })
      .overrideProvider(MatSnackBar, { useValue: snackbarService })
      .compileComponents();
  });

  it('should create the app and render empty board', () => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();

    const { header, menu, board, keypad } = getComponents(fixture);

    expect(header).toBeTruthy();
    expect(menu).toBeTruthy();
    expect(board).toBeTruthy();
    expect(keypad).toBeTruthy();

    expect(boardService.empty).toHaveBeenCalled();

    expect(menu.componentInstance.difficulty()).toEqual('random');
    expect(board.componentInstance.groups()).toEqual([
      [{ value: undefined }, { value: undefined }],
      [{ value: undefined }, { value: undefined }],
    ]);
  });

  it('should create the app and prompt the user to choose the difficulty', () => {
    boardService.generate.and.returnValue(
      of({
        groups: [
          [{ value: 1 }, { value: 2 }],
          [{ value: undefined }, { value: undefined }],
        ],
        difficulty: 'medium',
      })
    );

    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();

    const { menu, board } = getComponents(fixture);

    expect(boardService.empty).toHaveBeenCalled();
    expect(menuService.openDifficultyChooser).toHaveBeenCalledWith({
      disableClose: true,
    });

    menuService.resolveDifficulty('medium');
    fixture.detectChanges();

    expect(boardService.generate).toHaveBeenCalledWith('medium');

    expect(menu.componentInstance.difficulty()).toEqual('medium');
    expect(board.componentInstance.groups()).toEqual([
      [{ value: 1 }, { value: 2 }],
      [{ value: undefined }, { value: undefined }],
    ]);
  });

  it('should adapt layout depending on the screen size', () => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    const main = fixture.debugElement.query(By.css('main'));

    breakpointService.resolveBreakpoint(true);
    fixture.detectChanges();
    expect(fixture.nativeElement.style.cssText).toContain(
      '--app-boxed-width: 860px'
    );
    expect(main.nativeElement.classList).toContain('horizontal');

    breakpointService.resolveBreakpoint(false);
    fixture.detectChanges();
    expect(fixture.nativeElement.style.cssText).toContain(
      '--app-boxed-width: 480px'
    );
    expect(main.nativeElement.classList).toContain('vertical');
  });

  it('should create board when new event is triggered from the menu', () => {
    boardService.generate.and.returnValue(
      of({
        groups: [
          [{ value: 6 }, { value: 7 }],
          [{ value: 8 }, { value: 9 }],
        ],
        difficulty: 'hard',
      })
    );

    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();

    const { menu, board } = getComponents(fixture);

    menu.componentInstance.new.emit('hard');
    fixture.detectChanges();

    expect(boardService.generate).toHaveBeenCalledWith('hard');

    expect(menu.componentInstance.difficulty()).toEqual('hard');
    expect(board.componentInstance.groups()).toEqual([
      [{ value: 6 }, { value: 7 }],
      [{ value: 8 }, { value: 9 }],
    ]);
  });

  it('should solve board and render the solved one when new event is triggered from the menu', () => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();

    boardService.solve.and.returnValue(
      of({
        state: 'solved',
        board: {
          groups: [
            [{ value: 2 }, { value: 4 }],
            [{ value: 6 }, { value: 8 }],
          ],
          difficulty: 'hard',
        },
      })
    );

    const { menu, board } = getComponents(fixture);

    menu.componentInstance.solve.emit();
    fixture.detectChanges();

    expect(boardService.solve).toHaveBeenCalledWith([
      [{ value: undefined }, { value: undefined }],
      [{ value: undefined }, { value: undefined }],
    ]);

    expect(board.componentInstance.groups()).toEqual([
      [{ value: 2 }, { value: 4 }],
      [{ value: 6 }, { value: 8 }],
    ]);
  });

  it('should solve board and show a message when the board can not be solved', () => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();

    boardService.solve.and.returnValue(
      of({
        state: 'unsolvable',
        board: {
          groups: [
            [{ value: undefined }, { value: undefined }],
            [{ value: undefined }, { value: undefined }],
          ],
          difficulty: 'hard',
        },
      })
    );

    const { menu } = getComponents(fixture);

    menu.componentInstance.solve.emit();
    fixture.detectChanges();

    expect(boardService.solve).toHaveBeenCalledWith([
      [{ value: undefined }, { value: undefined }],
      [{ value: undefined }, { value: undefined }],
    ]);

    expect(snackbarService.open).toHaveBeenCalledWith(
      'Board is unsolvable!',
      'Dismiss',
      { duration: 5_000 }
    );
  });

  it('should validate board and show a message with the result', () => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();

    boardService.validate.and.returnValue(of('broken'));

    const { menu } = getComponents(fixture);

    menu.componentInstance.check.emit();
    fixture.detectChanges();

    expect(boardService.validate).toHaveBeenCalledWith([
      [{ value: undefined }, { value: undefined }],
      [{ value: undefined }, { value: undefined }],
    ]);

    expect(snackbarService.open).toHaveBeenCalledWith(
      'Board is broken!',
      'Dismiss',
      { duration: 5_000 }
    );
  });

  describe('when cell selected', () => {
    let fixture: ComponentFixture<AppComponent>;

    beforeEach(() => {
      boardService.generate.and.returnValue(
        of({
          groups: [
            [
              { value: undefined },
              { value: 7, state: 'selected' },
              { value: undefined },
              { value: 5 },
              { value: 3 },
              { value: undefined },
              { value: 9 },
              { value: 8 },
              { value: undefined },
            ],
            [
              { value: undefined },
              { value: undefined },
              { value: undefined },
              { value: 6 },
              { value: undefined },
              { value: undefined },
              { value: 2 },
              { value: 5 },
              { value: 7 },
            ],
            [
              { value: 5 },
              { value: 4 },
              { value: undefined },
              { value: 8 },
              { value: 2 },
              { value: undefined },
              { value: 6 },
              { value: 1 },
              { value: undefined },
            ],
            [
              { value: 1 },
              { value: 5 },
              { value: undefined },
              { value: 4 },
              { value: undefined },
              { value: undefined },
              { value: 8 },
              { value: undefined },
              { value: 2 },
            ],
            [
              { value: 3 },
              { value: undefined },
              { value: 6 },
              { value: undefined },
              { value: undefined },
              { value: undefined },
              { value: 7 },
              { value: undefined },
              { value: undefined },
            ],
            [
              { value: undefined },
              { value: undefined },
              { value: 4 },
              { value: undefined },
              { value: undefined },
              { value: 3 },
              { value: 1 },
              { value: undefined },
              { value: undefined },
            ],
            [
              { value: 4 },
              { value: 1 },
              { value: 5 },
              { value: 9 },
              { value: undefined },
              { value: 2 },
              { value: 3 },
              { value: 7 },
              { value: undefined },
            ],
            [
              { value: undefined },
              { value: 6 },
              { value: undefined },
              { value: undefined },
              { value: undefined },
              { value: undefined },
              { value: 4 },
              { value: undefined },
              { value: undefined },
            ],
            [
              { value: undefined },
              { value: undefined },
              { value: 8 },
              { value: undefined },
              { value: 7 },
              { value: undefined },
              { value: undefined },
              { value: 6 },
              { value: undefined },
            ],
          ],
          difficulty: 'easy',
        })
      );

      fixture = TestBed.createComponent(AppComponent);
      fixture.detectChanges();

      menuService.resolveDifficulty('easy');
    });

    it('should highlight selected cell', () => {
      const { board } = getComponents(fixture);

      board.componentInstance.select.emit({
        cell: { value: 6 },
        cellIndex: 3,
        group: [
          { value: undefined },
          { value: undefined },
          { value: undefined },
          { value: 6 },
          { value: undefined },
          { value: undefined },
          { value: 2 },
          { value: 5 },
          { value: 7 },
        ],
        groupIndex: 1,
      });

      fixture.detectChanges();

      expect(board.componentInstance.groups()[1][3]).toEqual({
        value: 6,
        state: 'selected',
      });
    });

    it('should remove highlight selected cell', () => {
      const { board } = getComponents(fixture);

      board.componentInstance.select.emit({
        cell: { value: 7, state: 'selected' },
        cellIndex: 3,
        group: [
          { value: undefined },
          { value: 7, state: 'selected' },
          { value: undefined },
          { value: 5 },
          { value: 3 },
          { value: undefined },
          { value: 9 },
          { value: 8 },
          { value: undefined },
        ],
        groupIndex: 0,
      });

      fixture.detectChanges();

      expect(board.componentInstance.groups()[0][1]).toEqual({
        value: 7,
        state: undefined,
      });
    });

    it('should highlight cells of the same cell group', () => {
      const { board } = getComponents(fixture);

      board.componentInstance.select.emit({
        cell: { value: 8 },
        cellIndex: 2,
        group: [
          { value: undefined },
          { value: undefined },
          { value: 8 },
          { value: undefined },
          { value: 7 },
          { value: undefined },
          { value: undefined },
          { value: 6 },
          { value: undefined },
        ],
        groupIndex: 8,
      });

      fixture.detectChanges();

      expect(board.componentInstance.groups()[8]).toEqual([
        { value: undefined, state: 'marked' },
        { value: undefined, state: 'marked' },
        { value: 8, state: 'selected' },
        { value: undefined, state: 'marked' },
        { value: 7, state: 'marked' },
        { value: undefined, state: 'marked' },
        { value: undefined, state: 'marked' },
        { value: 6, state: 'marked' },
        { value: undefined, state: 'marked' },
      ]);
    });

    it('should highlight cells of the same row', () => {
      const { board } = getComponents(fixture);

      board.componentInstance.select.emit({
        cell: { value: 8 },
        cellIndex: 2,
        group: [
          { value: undefined },
          { value: undefined },
          { value: 8 },
          { value: undefined },
          { value: 7 },
          { value: undefined },
          { value: undefined },
          { value: 6 },
          { value: undefined },
        ],
        groupIndex: 8,
      });

      fixture.detectChanges();

      const groups = board.componentInstance.groups();

      expect(groups[6][0]).toEqual({ value: 4, state: 'marked' });
      expect(groups[6][1]).toEqual({ value: 1, state: 'marked' });
      expect(groups[6][2]).toEqual({ value: 5, state: 'marked' });
      expect(groups[6][3]).toEqual({ value: 9, state: undefined });
      expect(groups[6][4]).toEqual({ value: undefined, state: undefined });
      expect(groups[6][5]).toEqual({ value: 2, state: undefined });
      expect(groups[6][6]).toEqual({ value: 3, state: undefined });
      expect(groups[6][7]).toEqual({ value: 7, state: undefined });
      expect(groups[6][8]).toEqual({ value: undefined, state: undefined });

      expect(groups[7][0]).toEqual({ value: undefined, state: 'marked' });
      expect(groups[7][1]).toEqual({ value: 6, state: 'marked' });
      expect(groups[7][2]).toEqual({ value: undefined, state: 'marked' });
      expect(groups[7][3]).toEqual({ value: undefined, state: undefined });
      expect(groups[7][4]).toEqual({ value: undefined, state: undefined });
      expect(groups[7][5]).toEqual({ value: undefined, state: undefined });
      expect(groups[7][6]).toEqual({ value: 4, state: undefined });
      expect(groups[7][7]).toEqual({ value: undefined, state: undefined });
      expect(groups[7][8]).toEqual({ value: undefined, state: undefined });
    });

    it('should highlight cells of the same column', () => {
      const { board } = getComponents(fixture);

      board.componentInstance.select.emit({
        cell: { value: 8 },
        cellIndex: 2,
        group: [
          { value: undefined },
          { value: undefined },
          { value: 8 },
          { value: undefined },
          { value: 7 },
          { value: undefined },
          { value: undefined },
          { value: 6 },
          { value: undefined },
        ],
        groupIndex: 8,
      });

      fixture.detectChanges();

      const groups = board.componentInstance.groups();

      expect(groups[2][0]).toEqual({ value: 5, state: undefined });
      expect(groups[2][1]).toEqual({ value: 4, state: undefined });
      expect(groups[2][2]).toEqual({ value: undefined, state: 'marked' });
      expect(groups[2][3]).toEqual({ value: 8, state: 'highlighted' });
      expect(groups[2][4]).toEqual({ value: 2, state: undefined });
      expect(groups[2][5]).toEqual({ value: undefined, state: 'marked' });
      expect(groups[2][6]).toEqual({ value: 6, state: undefined });
      expect(groups[2][7]).toEqual({ value: 1, state: undefined });
      expect(groups[2][8]).toEqual({ value: undefined, state: 'marked' });

      expect(groups[5][0]).toEqual({ value: undefined, state: undefined });
      expect(groups[5][1]).toEqual({ value: undefined, state: undefined });
      expect(groups[5][2]).toEqual({ value: 4, state: 'marked' });
      expect(groups[5][3]).toEqual({ value: undefined, state: undefined });
      expect(groups[5][4]).toEqual({ value: undefined, state: undefined });
      expect(groups[5][5]).toEqual({ value: 3, state: 'marked' });
      expect(groups[5][6]).toEqual({ value: 1, state: undefined });
      expect(groups[5][7]).toEqual({ value: undefined, state: undefined });
      expect(groups[5][8]).toEqual({ value: undefined, state: 'marked' });
    });

    it('should highlight cells with the same value', () => {
      const { board } = getComponents(fixture);

      board.componentInstance.select.emit({
        cell: { value: 8 },
        cellIndex: 2,
        group: [
          { value: undefined },
          { value: undefined },
          { value: 8 },
          { value: undefined },
          { value: 7 },
          { value: undefined },
          { value: undefined },
          { value: 6 },
          { value: undefined },
        ],
        groupIndex: 8,
      });

      fixture.detectChanges();

      const groups = board.componentInstance.groups();

      expect(groups[0][7]).toEqual({ value: 8, state: 'highlighted' });
      expect(groups[2][3]).toEqual({ value: 8, state: 'highlighted' });
      expect(groups[3][6]).toEqual({ value: 8, state: 'highlighted' });
    });
  });

  describe('when keypad is pressed', () => {
    let fixture: ComponentFixture<AppComponent>;

    beforeEach(() => {
      boardService.generate.and.returnValue(
        of({
          groups: [
            [
              { value: undefined },
              { value: 7, state: 'selected' },
              { value: undefined },
              { value: 5, prefilled: true },
              { value: 3 },
              { value: undefined },
              { value: 9 },
              { value: 8 },
              { value: undefined },
            ],
            [
              { value: undefined },
              { value: undefined },
              { value: undefined },
              { value: 6 },
              { value: undefined },
              { value: undefined },
              { value: 2 },
              { value: 5 },
              { value: 7 },
            ],
            [
              { value: 5 },
              { value: 4 },
              { value: undefined },
              { value: 8 },
              { value: 2 },
              { value: undefined },
              { value: 6 },
              { value: 1 },
              { value: undefined },
            ],
            [
              { value: 1 },
              { value: 5 },
              { value: undefined },
              { value: 4 },
              { value: undefined },
              { value: undefined },
              { value: 8 },
              { value: undefined },
              { value: 2 },
            ],
            [
              { value: 3 },
              { value: undefined },
              { value: 6 },
              { value: undefined },
              { value: undefined },
              { value: undefined },
              { value: 7 },
              { value: undefined },
              { value: undefined },
            ],
            [
              { value: undefined },
              { value: undefined },
              { value: 4 },
              { value: undefined },
              { value: undefined },
              { value: 3 },
              { value: 1 },
              { value: undefined },
              { value: undefined },
            ],
            [
              { value: 4 },
              { value: 1 },
              { value: 5 },
              { value: 9 },
              { value: undefined },
              { value: 2 },
              { value: 3 },
              { value: 7 },
              { value: undefined },
            ],
            [
              { value: undefined },
              { value: 6 },
              { value: undefined },
              { value: undefined },
              { value: undefined },
              { value: undefined },
              { value: 4 },
              { value: undefined },
              { value: undefined },
            ],
            [
              { value: undefined },
              { value: undefined },
              { value: 8 },
              { value: undefined },
              { value: 7 },
              { value: undefined },
              { value: undefined },
              { value: 6 },
              { value: undefined },
            ],
          ],
          difficulty: 'easy',
        })
      );

      fixture = TestBed.createComponent(AppComponent);
      fixture.detectChanges();

      menuService.resolveDifficulty('easy');
    });

    it('should update selected cell', () => {
      const { board, keypad } = getComponents(fixture);

      board.componentInstance.select.emit({
        cell: { value: 6 },
        cellIndex: 3,
        group: [
          { value: undefined },
          { value: undefined },
          { value: undefined },
          { value: 6 },
          { value: undefined },
          { value: undefined },
          { value: 2 },
          { value: 5 },
          { value: 7 },
        ],
        groupIndex: 1,
      });

      fixture.detectChanges();

      keypad.componentInstance.press.emit(3);

      fixture.detectChanges();

      expect(board.componentInstance.groups()[1][3]).toEqual({
        value: 3,
        state: 'selected',
      });
    });

    it('should not update selected cell when it is prefilled', () => {
      const { board, keypad } = getComponents(fixture);

      board.componentInstance.select.emit({
        cell: { value: 5, prefilled: true },
        cellIndex: 3,
        group: [
          [
            { value: undefined },
            { value: 7, state: 'selected' },
            { value: undefined },
            { value: 5, prefilled: true },
            { value: 3 },
            { value: undefined },
            { value: 9 },
            { value: 8 },
            { value: undefined },
          ],
        ],
        groupIndex: 0,
      });

      fixture.detectChanges();

      keypad.componentInstance.press.emit(4);

      fixture.detectChanges();

      expect(board.componentInstance.groups()[0][3]).toEqual({
        value: 5,
        state: 'selected',
        prefilled: true,
      });
    });
  });

  describe('when keyboard is pressed', () => {
    let fixture: ComponentFixture<AppComponent>;

    beforeEach(() => {
      boardService.generate.and.returnValue(
        of({
          groups: [
            [
              { value: undefined },
              { value: 7, state: 'selected' },
              { value: undefined },
              { value: 5, prefilled: true },
              { value: 3 },
              { value: undefined },
              { value: 9 },
              { value: 8 },
              { value: undefined },
            ],
            [
              { value: undefined },
              { value: undefined },
              { value: undefined },
              { value: 6 },
              { value: undefined },
              { value: undefined },
              { value: 2 },
              { value: 5 },
              { value: 7 },
            ],
            [
              { value: 5 },
              { value: 4 },
              { value: undefined },
              { value: 8 },
              { value: 2 },
              { value: undefined },
              { value: 6 },
              { value: 1 },
              { value: undefined },
            ],
            [
              { value: 1 },
              { value: 5 },
              { value: undefined },
              { value: 4 },
              { value: undefined },
              { value: undefined },
              { value: 8 },
              { value: undefined },
              { value: 2 },
            ],
            [
              { value: 3 },
              { value: undefined },
              { value: 6 },
              { value: undefined },
              { value: undefined },
              { value: undefined },
              { value: 7 },
              { value: undefined },
              { value: undefined },
            ],
            [
              { value: undefined },
              { value: undefined },
              { value: 4 },
              { value: undefined },
              { value: undefined },
              { value: 3 },
              { value: 1 },
              { value: undefined },
              { value: undefined },
            ],
            [
              { value: 4 },
              { value: 1 },
              { value: 5 },
              { value: 9 },
              { value: undefined },
              { value: 2 },
              { value: 3 },
              { value: 7 },
              { value: undefined },
            ],
            [
              { value: undefined },
              { value: 6 },
              { value: undefined },
              { value: undefined },
              { value: undefined },
              { value: undefined },
              { value: 4 },
              { value: undefined },
              { value: undefined },
            ],
            [
              { value: undefined },
              { value: undefined },
              { value: 8 },
              { value: undefined },
              { value: 7 },
              { value: undefined },
              { value: undefined },
              { value: 6 },
              { value: undefined },
            ],
          ],
          difficulty: 'easy',
        })
      );

      fixture = TestBed.createComponent(AppComponent);
      fixture.detectChanges();

      menuService.resolveDifficulty('easy');
    });

    it('should update selected cell', () => {
      const { board } = getComponents(fixture);

      board.componentInstance.select.emit({
        cell: { value: 6 },
        cellIndex: 3,
        group: [
          { value: undefined },
          { value: undefined },
          { value: undefined },
          { value: 6 },
          { value: undefined },
          { value: undefined },
          { value: 2 },
          { value: 5 },
          { value: 7 },
        ],
        groupIndex: 1,
      });

      fixture.detectChanges();

      document.dispatchEvent(new KeyboardEvent('keypress', { key: '3' }));

      fixture.detectChanges();

      expect(board.componentInstance.groups()[1][3]).toEqual({
        value: 3,
        state: 'selected',
      });
    });

    it('should not update selected cell when it is prefilled', () => {
      const { board, keypad } = getComponents(fixture);

      board.componentInstance.select.emit({
        cell: { value: 5, prefilled: true },
        cellIndex: 3,
        group: [
          [
            { value: undefined },
            { value: 7, state: 'selected' },
            { value: undefined },
            { value: 5, prefilled: true },
            { value: 3 },
            { value: undefined },
            { value: 9 },
            { value: 8 },
            { value: undefined },
          ],
        ],
        groupIndex: 0,
      });

      fixture.detectChanges();

      document.dispatchEvent(new KeyboardEvent('keypress', { key: '4' }));

      fixture.detectChanges();

      expect(board.componentInstance.groups()[0][3]).toEqual({
        value: 5,
        state: 'selected',
        prefilled: true,
      });
    });

    it('should not update selected cell when key value is not 1-9', () => {
      const { board, keypad } = getComponents(fixture);

      board.componentInstance.select.emit({
        cell: { value: 6 },
        cellIndex: 3,
        group: [
          { value: undefined },
          { value: undefined },
          { value: undefined },
          { value: 6 },
          { value: undefined },
          { value: undefined },
          { value: 2 },
          { value: 5 },
          { value: 7 },
        ],
        groupIndex: 1,
      });

      fixture.detectChanges();

      document.dispatchEvent(new KeyboardEvent('keypress', { key: 'A' }));

      fixture.detectChanges();

      expect(board.componentInstance.groups()[1][3]).toEqual({
        value: 6,
        state: 'selected',
      });
    });
  });
});
