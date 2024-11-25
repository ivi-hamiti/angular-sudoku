import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CellComponent } from './cell.component';
import { By } from '@angular/platform-browser';

describe('CellComponent', () => {
  let fixture: ComponentFixture<CellComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CellComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CellComponent);
  });

  it('should render value', () => {
    fixture.componentRef.setInput('value', 1);
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toBe('1');
  });

  it('should render should be empty when no value', () => {
    fixture.componentRef.setInput('value', undefined);
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toBe('');
  });

  it('should apply custom style when prefilled', () => {
    fixture.componentRef.setInput('prefilled', true);
    fixture.detectChanges();

    expect(fixture.nativeElement.classList).toContain('prefilled');
  });

  it('should apply custom style when highlighted', () => {
    fixture.componentRef.setInput('state', 'highlighted');
    fixture.detectChanges();

    expect(fixture.nativeElement.classList).toContain('highlighted');
  });

  it('should apply custom style when selected', () => {
    fixture.componentRef.setInput('state', 'selected');
    fixture.detectChanges();

    expect(fixture.nativeElement.classList).toContain('selected');
  });

  it('should apply custom style when marked', () => {
    fixture.componentRef.setInput('state', 'marked');
    fixture.detectChanges();

    expect(fixture.nativeElement.classList).toContain('marked');
  });
});
