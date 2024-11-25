import { Component, input, output } from '@angular/core';
import { CellGroupComponent } from './cell-group/cell-group.component';
import { BoardCell, BoardGroup } from '../app.models';

export type BoardSelectedEvent = { cell: BoardCell; group: BoardGroup };

@Component({
  selector: 'app-board',
  imports: [CellGroupComponent],
  template: `
    @for (group of groups(); track y; let y = $index) {
      <app-cell-group
        [group]="group"
        (selected)="select.emit({ cell: $event, group })"
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
  groups = input.required<BoardGroup[]>();
}
