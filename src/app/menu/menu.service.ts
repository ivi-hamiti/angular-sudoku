import { inject, Injectable } from '@angular/core';
import {
  MatDialog,
  MatDialogConfig,
  MatDialogRef,
} from '@angular/material/dialog';
import { BoardDifficulty } from '../app.models';
import { ChooseDifficultyDialogComponent } from './choose-difficulty-dialog/choose-difficulty-dialog.component';

@Injectable({
  providedIn: 'root',
})
export class MenuService {
  private readonly dialog = inject(MatDialog);

  openDifficultyChooser = (
    options?: Pick<
      MatDialogConfig<ChooseDifficultyDialogComponent>,
      'disableClose'
    >
  ): MatDialogRef<ChooseDifficultyDialogComponent, BoardDifficulty> => {
    return this.dialog.open<
      ChooseDifficultyDialogComponent,
      ChooseDifficultyDialogComponent,
      BoardDifficulty
    >(ChooseDifficultyDialogComponent, { ...options, width: '480px' });
  };
}
