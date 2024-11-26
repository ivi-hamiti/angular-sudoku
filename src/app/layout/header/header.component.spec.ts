import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HeaderComponent } from './header.component';
import { By } from '@angular/platform-browser';

describe('HeaderComponent', () => {
  let fixture: ComponentFixture<HeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HeaderComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(HeaderComponent);
    fixture.detectChanges();
  });

  it('should render theme switch button', () => {
    const themeButton = fixture.debugElement.query(By.css('button:last-child'));

    expect(themeButton.nativeElement.textContent.trim()).toBe('Theme');
  });

  it('should set theme class to document', () => {
    expect(document.documentElement.classList).toContain('theme-light');
  });

  it('should toggle theme class to document on theme button click', () => {
    const themeButton = fixture.debugElement.query(By.css('button:last-child'));

    themeButton.triggerEventHandler('click', undefined);
    fixture.detectChanges();
    expect(document.documentElement.classList).toContain('theme-dark');
    expect(document.documentElement.classList).not.toContain('theme-light');

    themeButton.triggerEventHandler('click', undefined);
    fixture.detectChanges();
    expect(document.documentElement.classList).toContain('theme-light');
    expect(document.documentElement.classList).not.toContain('theme-dark');
  });
});
