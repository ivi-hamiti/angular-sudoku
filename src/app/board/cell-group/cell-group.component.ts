import { Component, input, output } from '@angular/core';
import { CellComponent } from '../cell/cell.component';
import { BoardCell, BoardCellGroup } from '../../app.models';

export type CellGroupSelectEvent = {
  cell: BoardCell;
  cellIndex: number;
};

@Component({
  selector: 'app-cell-group',
  imports: [CellComponent],
  template: `
    @for (cell of group(); track $index) {
      <app-cell
        [value]="cell.value"
        [state]="cell.state"
        [prefilled]="cell.prefilled"
        (click)="select.emit({ cell, cellIndex: $index })"
      />
    }
  `,
  styles: `
    :host {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      justify-content: stretch;
      align-items: stretch;
      gap: 1px;
      overflow: hidden;
      background-color: var(--mat-sys-surface-tint);
    }
  `,
})
export class CellGroupComponent {
  group = input.required<BoardCellGroup>();
  select = output<CellGroupSelectEvent>();
}
