import { TitleCasePipe } from '@angular/common';
import { Component, inject, input, output } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { BoardDifficulty } from '../app.models';
import { MenuService } from './menu.service';

@Component({
  selector: 'app-menu',
  imports: [MatButton, MatIcon, TitleCasePipe],
  template: `
    <span class="difficulty">Difficulty: {{ difficulty() | titlecase }}</span>
    <button mat-button (click)="chooseDifficulty()">
      <mat-icon fontIcon="add" /> New
    </button>
    <button mat-button (click)="solve.emit()">
      <mat-icon fontIcon="auto_awesome" /> Solve
    </button>
    <button mat-button (click)="check.emit()">
      <mat-icon fontIcon="done_all" /> Check
    </button>
  `,
  styles: `
    :host {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 0.5rem;
      justify-content: space-between;
      align-items: center;
    }

    .difficulty {
      font-size: var(--mat-sys-label-large-size);
      color: var(--mat-sys-tertiary);
      background-color: var(--mat-sys-tertiary-container);
      grid-column: 1 / -1;
      height: 2.5rem;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: var(--mat-sys-corner-full);
    }
  `,
})
export class MenuComponent {
  private readonly menuService = inject(MenuService);

  difficulty = input.required<BoardDifficulty>();
  new = output<BoardDifficulty>();
  solve = output();
  check = output();

  chooseDifficulty = (): void => {
    this.menuService
      .openDifficultyChooser()
      .afterClosed()
      .subscribe((difficulty) => {
        if (difficulty) {
          this.new.emit(difficulty);
        }
      });
  };
}
