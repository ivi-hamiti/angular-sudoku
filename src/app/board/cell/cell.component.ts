import { Component, input, output } from '@angular/core';
import { BoardCellState, Cell } from '../../app.models';

@Component({
  selector: 'app-cell',
  template: `{{ value() }}`,
  host: {
    '[class.highlighted]': 'state() === "highlighted"',
    '[class.selected]': 'state() === "selected"',
    '[class.marked]': 'state() === "marked"',
    '[class.prefilled]': 'prefilled()',
  },
  styles: `
    :host {
      display: flex;
      align-items: center;
      justify-content: center;
      aspect-ratio: 1;
      background-color: var(--mat-sys-surface);
      font-size: min(8vw, 2.5rem);
      user-select: none;
      color: var(--mat-sys-inverse-surface);

      &:hover {
        cursor: pointer;
      }

      &.prefilled {
        color: var(--mat-sys-primary);
      }

      &.selected {
        background-color: var(--mat-sys-inverse-primary);
      }

      &.highlighted {
        background-color: var(--mat-sys-secondary-container);
      }

      &.marked {
        background-color: var(--mat-sys-surface-container-highest);
      }
    }

  `,
})
export class CellComponent {
  value = input<Cell>();
  state = input<BoardCellState>();
  prefilled = input<boolean>();
}
