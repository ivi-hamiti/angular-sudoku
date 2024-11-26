import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KeypadComponent } from './keypad.component';
import { By } from '@angular/platform-browser';

describe('KeypadComponent', () => {
  let fixture: ComponentFixture<KeypadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [KeypadComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(KeypadComponent);
    fixture.detectChanges();
  });

  it('should render buttons from 1-9', () => {
    const buttons = fixture.debugElement.queryAll(By.css('button'));

    expect(buttons.length).toBe(9);
    expect(buttons[0].nativeElement.textContent).toBe('1');
    expect(buttons[1].nativeElement.textContent).toBe('2');
    expect(buttons[2].nativeElement.textContent).toBe('3');
    expect(buttons[3].nativeElement.textContent).toBe('4');
    expect(buttons[4].nativeElement.textContent).toBe('5');
    expect(buttons[5].nativeElement.textContent).toBe('6');
    expect(buttons[6].nativeElement.textContent).toBe('7');
    expect(buttons[7].nativeElement.textContent).toBe('8');
    expect(buttons[8].nativeElement.textContent).toBe('9');
  });

  it('should render different layout', () => {
    fixture.componentRef.setInput('layout', 'row');
    fixture.detectChanges();

    expect(fixture.nativeElement.classList).toContain('row');

    fixture.componentRef.setInput('layout', 'grid');
    fixture.detectChanges();

    expect(fixture.nativeElement.classList).toContain('grid');
  });

  it('should trigger press event when buttons are clicked', () => {
    const buttons = fixture.debugElement.queryAll(By.css('button'));
    const handler = jasmine.createSpy('handler');

    fixture.componentInstance.press.subscribe(handler);

    for (const [index, button] of buttons.entries()) {
      handler.calls.reset();
      button.triggerEventHandler('click', undefined);

      expect(handler).toHaveBeenCalledWith(index + 1);
    }
  });
});
