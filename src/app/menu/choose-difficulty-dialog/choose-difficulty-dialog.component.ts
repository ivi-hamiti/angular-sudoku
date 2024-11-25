import { Component, inject } from '@angular/core';
import { MatButton } from '@angular/material/button';
import {
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle,
} from '@angular/material/dialog';
import { BoardDifficulty } from '../../app.models';

@Component({
  selector: 'app-choose-difficulty-dialog',
  imports: [MatDialogContent, MatDialogTitle, MatButton],
  template: `
    <h2 mat-dialog-title>Choose Difficulty</h2>
    <mat-dialog-content>
      <button mat-flat-button (click)="chooseDifficulty('easy')">Easy</button>
      <button mat-flat-button (click)="chooseDifficulty('medium')">
        Medium
      </button>
      <button mat-flat-button (click)="chooseDifficulty('hard')">Hard</button>
      <button mat-flat-button (click)="chooseDifficulty('random')">
        Random
      </button>
    </mat-dialog-content>
  `,
  styles: `
    mat-dialog-content {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    mat-dialog-title {
      color: var(--mat-sys-inverse-surface);
    }
  `,
})
export class ChooseDifficultyDialogComponent {
  private readonly dialog = inject(MatDialogRef<BoardDifficulty>);

  chooseDifficulty = (difficulty: BoardDifficulty): void => {
    this.dialog.close(difficulty);
  };
}
