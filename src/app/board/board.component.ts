import { Component, input, output } from '@angular/core';
import { CellGroupComponent } from './cell-group/cell-group.component';
import { BoardCell, BoardCellGroup } from '../app.models';

export type BoardSelectedEvent = {
  cell: BoardCell;
  cellIndex: number;
  group: BoardCellGroup;
  groupIndex: number;
};

@Component({
  selector: 'app-board',
  imports: [CellGroupComponent],
  template: `
    @for (group of groups(); track $index) {
    <app-cell-group
      [group]="group"
      (select)="
        select.emit({
          cell: $event.cell,
          cellIndex: $event.cellIndex,
          group,
          groupIndex: $index
        })
      "
    />
    }
  `,
  styles: `
    :host {
      max-width: 100%;
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      justify-content: stretch;
      align-items: stretch;

      border-radius: 8px;
      overflow: hidden;
      border: 3px solid var(--mat-sys-surface-tint);
      background-color: var(--mat-sys-surface-tint);
      gap: 3px;
    }
  `,
})
export class BoardComponent {
  select = output<BoardSelectedEvent>();
  groups = input.required<BoardCellGroup[]>();
}
