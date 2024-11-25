import { DOCUMENT } from '@angular/common';
import { Component, inject } from '@angular/core';
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

  theme: AppTheme = 'light';

  ngOnInit(): void {
    this.setTheme(this.theme);
  }

  setTheme(theme: AppTheme): void {
    this.theme = theme;
    this.document.documentElement.classList.remove('theme-light', 'theme-dark');
    this.document.documentElement.classList.add(`theme-${theme}`);
  }

  switchTheme(): void {
    switch (this.theme) {
      case 'light':
        return this.setTheme('dark');
      case 'dark':
        return this.setTheme('light');
    }
  }
}
