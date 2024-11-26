import { DOCUMENT } from '@angular/common';
import { Component, effect, inject, signal } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';

type AppTheme = 'light' | 'dark';

@Component({
  selector: 'app-header',
  imports: [MatIcon, MatButton],
  template: `
    <header>
      <button mat-button><mat-icon fontIcon="apps" /> Sudoku</button>
      <button mat-button (click)="switchTheme()">
        <mat-icon fontIcon="contrast" /> Theme
      </button>
    </header>
  `,
  styles: `
    :host {
      display: block;
      background-color: var(--mat-sys-primary-container);
    }

    header {
      max-width: var(--app-boxed-width);
      padding: 0.5rem;
      margin: 0 auto;
      display: flex;
      justify-content: space-between;
    }
  `,
})
export class HeaderComponent {
  private readonly document = inject(DOCUMENT);

  theme = signal<AppTheme>('light');

  constructor() {
    effect(() => {
      this.document.documentElement.classList.remove(
        'theme-light',
        'theme-dark'
      );
      this.document.documentElement.classList.add(`theme-${this.theme()}`);
    });
  }

  switchTheme(): void {
    this.theme.update((active) => {
      if (active !== 'light') {
        return 'light';
      } else {
        return 'dark';
      }
    });
  }
}
