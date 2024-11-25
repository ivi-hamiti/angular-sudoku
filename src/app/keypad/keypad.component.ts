import { Component, input, output } from '@angular/core';
import { MatButton } from '@angular/material/button';

@Component({
  selector: 'app-keypad',
  imports: [MatButton],
  template: `
    @for (key of keys; track key) {
      @if (layout() === 'row') {
        <button mat-button (click)="press.emit(key)">{{ key }}</button>
      } @else {
        <button mat-flat-button (click)="press.emit(key)">{{ key }}</button>
      }
    }
    <span class="hint">
      You can use also your keyboard to input the values by selecting first the
      cell you want to change
    </span>
  `,
  host: {
    '[class.row]': 'layout() === "row"',
    '[class.grid]': 'layout() === "grid"',
  },
  styles: `
    @use '@angular/material' as mat;

    :host {
      display: grid;
      justify-content: stretch;
      align-items: stretch;

      &.grid {
        grid-template-columns: repeat(3, 1fr);
        gap: 8px;
      }

      &.row {
        grid-template-columns: repeat(9, 1fr);
        gap: 4px;
      }
    }

    .hint {
      color: var(--mat-sys-secondary);
      grid-column: 1 / -1;
      margin-top: 8px;
      text-align: center;
    }

    button {
      font-size: min(8vw, 2.5rem);
      height: 1.3em;
      min-width: 0;
      padding: 0;
    }
  `,
})
export class KeypadComponent {
  readonly keys = [1, 2, 3, 4, 5, 6, 7, 8, 9];

  press = output<number>();
  layout = input<'row' | 'grid'>('row');
}
