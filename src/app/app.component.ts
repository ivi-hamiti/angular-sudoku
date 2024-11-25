import { BreakpointObserver } from '@angular/cdk/layout';
import { DOCUMENT } from '@angular/common';
import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import {
  BoardDifficulty,
  BoardGroup,
  same,
  sameColumn,
  sameRow,
} from './app.models';
import { BoardComponent, BoardSelectedEvent } from './board/board.component';
import { BoardService } from './board/board.service';
import { KeypadComponent } from './keypad/keypad.component';
import { HeaderComponent } from './layout/header/header.component';
import { MenuComponent } from './menu/menu.component';
import { MenuService } from './menu/menu.service';

type Layout = 'vertical' | 'horizontal';
type Selection = { cellIndex: number; groupIndex: number };

@Component({
  selector: 'app-root',
  imports: [HeaderComponent, BoardComponent, KeypadComponent, MenuComponent],
  template: `
    <app-header />
    <main
      [class.horizontal]="layout() === 'horizontal'"
      [class.vertical]="layout() === 'vertical'"
    >
      <app-menu
        [difficulty]="difficulty()"
        (new)="newBoard($event)"
        (solve)="solveBoard()"
        (check)="checkBoard()"
      />
      <app-board [groups]="groups()" (select)="highlightBoard($event)" />
      <app-keypad
        [layout]="layout() === 'horizontal' ? 'grid' : 'row'"
        (press)="updateCellFromValue($event)"
      />
    </main>
  `,
  host: {
    '[style.--app-boxed-width]':
      'layout() === "horizontal" ? "860px" : "480px"',
  },
  styles: `
    :host {
      display: block;
    }

    main {
      display: grid;
      padding: 1rem 0.5rem;
      align-items: start;
      gap: 1rem;
      overflow: hidden;
      margin: 0 auto;
      max-width: var(--app-boxed-width);

      &.horizontal {
        grid-template-columns: 480px auto;
        grid-template-rows: auto 1fr;
        grid-template-areas: "board menu" "board keypad" "board keypad";
      }

      &.vertical {
        grid-template-areas: "menu" "board" "keypad";
      }
    }

    app-menu {
      grid-area: menu;
    }

    app-board {
      grid-area: board;
    }

    app-keypad {
      grid-area: keypad;
    }
  `,
})
export class AppComponent implements OnInit {
  private readonly boardService = inject(BoardService);
  private readonly menuService = inject(MenuService);
  private readonly document = inject(DOCUMENT);
  private readonly breakpointObserver = inject(BreakpointObserver);
  private readonly destroyRef = inject(DestroyRef);
  private readonly snackbar = inject(MatSnackBar);

  selected = signal<Selection | undefined>(undefined);
  layout = signal<Layout>('horizontal');

  difficulty = signal<BoardDifficulty>('random');
  groups = signal<BoardGroup[]>([]);

  constructor() {
    this.document.addEventListener('keypress', this.updateCellFromKeyboard);

    const breakpointSubscription = this.breakpointObserver
      .observe('(min-width: 960px)')
      .subscribe((state) => {
        if (state.matches) {
          this.layout.set('horizontal');
        } else {
          this.layout.set('vertical');
        }
      });

    this.destroyRef.onDestroy(() => {
      this.document.removeEventListener(
        'keypress',
        this.updateCellFromKeyboard
      );
      breakpointSubscription.unsubscribe();
    });
  }

  ngOnInit(): void {
    const empty = this.boardService.empty();

    this.groups.set(empty.groups);
    this.difficulty.set(empty.difficulty);

    this.menuService
      .openDifficultyChooser({ disableClose: true })
      .afterClosed()
      .subscribe((difficulty) => {
        if (difficulty) {
          this.newBoard(difficulty);
        }
      });
  }

  newBoard = (difficulty: BoardDifficulty): void => {
    this.boardService.generate(difficulty).subscribe((board) => {
      this.groups.set(board.groups);
      this.difficulty.set(board.difficulty);
    });
  };

  solveBoard = (): void => {
    this.boardService.solve(this.groups()).subscribe((result) => {
      if (result.state === 'solved') {
        this.groups.set(result.board.groups);
      } else {
        this.snackbar.open(`Board is ${result.state}!`, 'Dismiss', {
          duration: 5_000,
        });
      }
    });
  };

  checkBoard = (): void => {
    this.boardService.validate(this.groups()).subscribe((result) => {
      this.snackbar.open(`Board is ${result}!`, 'Dismiss', { duration: 5_000 });
    });
  };

  updateCellFromKeyboard = (event: KeyboardEvent): void => {
    const value = parseInt(event.key, 10);

    if (!isNaN(value)) {
      this.updateCellFromValue(value);
    }
  };

  updateCellFromValue = (value: number): void => {
    const selected = this.selected();

    if (selected && value >= 1 && value <= 9) {
      this.groups.update((groups) => {
        const selectedCell =
          groups[selected.groupIndex].cells[selected.cellIndex];

        if (!selectedCell.prefilled) {
          selectedCell.value = value;
        }

        return groups;
      });
    }
  };

  highlightBoard = ({
    cell: selectedCell,
    group: selectedGroup,
  }: BoardSelectedEvent): void => {
    const groups = this.groups();

    if (selectedCell.state === 'selected') {
      this.selected.set(undefined);

      groups.forEach((group) => {
        group.cells.forEach((cell) => {
          cell.state = undefined;
        });
      });

      for (const group of groups) {
        for (const cell of group.cells) {
          cell.state = undefined;
        }
      }
    } else {
      groups.forEach((group, groupIndex) => {
        group.cells.forEach((cell, cellIndex) => {
          if (same(cell, selectedCell)) {
            cell.state = 'selected';
            this.selected.set({ cellIndex, groupIndex });
          } else if (cell.value === selectedCell.value && selectedCell.value) {
            cell.state = 'highlighted';
          } else if (
            same(group, selectedGroup) ||
            sameRow(cell, selectedCell) ||
            sameColumn(cell, selectedCell)
          ) {
            cell.state = 'marked';
          } else {
            cell.state = undefined;
          }
        });
      });
    }

    this.groups.set(groups);
  };
}
