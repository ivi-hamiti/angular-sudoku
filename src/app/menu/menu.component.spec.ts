import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MenuComponent } from './menu.component';
import { Subject } from 'rxjs';
import { BoardDifficulty } from '../app.models';
import { MenuService } from './menu.service';
import { By } from '@angular/platform-browser';

describe('MenuComponent', () => {
  let fixture: ComponentFixture<MenuComponent>;

  const menuServiceSubject = new Subject<BoardDifficulty>();
  const menuService = {
    resolveDifficulty: (difficulty: BoardDifficulty) => {
      menuServiceSubject.next(difficulty);
      menuServiceSubject.complete;
    },
    openDifficultyChooser: jasmine
      .createSpy('openDifficultyChooser')
      .and.returnValue({
        afterClosed: jasmine
          .createSpy('afterClosed')
          .and.returnValue(menuServiceSubject),
      }),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [MenuComponent] })
      .overrideProvider(MenuService, { useValue: menuService })
      .compileComponents();

    fixture = TestBed.createComponent(MenuComponent);
    fixture.componentRef.setInput('difficulty', 'easy');
    fixture.detectChanges();
  });

  it('should render info and actions', () => {
    const info = fixture.debugElement.query(By.css('.difficulty'));
    expect(info.nativeElement.textContent.trim()).toBe('Difficulty: Easy');

    const buttons = fixture.debugElement.queryAll(By.css('button'));
    expect(buttons.length).toBe(3);
    expect(buttons[0].nativeElement.textContent.trim()).toBe('New');
    expect(buttons[1].nativeElement.textContent.trim()).toBe('Solve');
    expect(buttons[2].nativeElement.textContent.trim()).toBe('Check');
  });

  it('should open difficulty chooser dialog and trigger new event on new button click', () => {
    const button = fixture.debugElement.query(By.css('button:nth-of-type(1)'));
    const handler = jasmine.createSpy('handler');

    fixture.componentInstance.new.subscribe(handler);
    button.triggerEventHandler('click', undefined);

    expect(menuService.openDifficultyChooser).toHaveBeenCalled();

    menuService.resolveDifficulty('medium');

    expect(handler).toHaveBeenCalledWith('medium');
  });

  it('should trigger solve event on solve button click', () => {
    const button = fixture.debugElement.query(By.css('button:nth-of-type(2)'));
    const handler = jasmine.createSpy('handler');

    fixture.componentInstance.solve.subscribe(handler);
    button.triggerEventHandler('click', undefined);

    expect(handler).toHaveBeenCalled();
  });

  it('should trigger check event on check button click', () => {
    const button = fixture.debugElement.query(By.css('button:nth-of-type(3)'));
    const handler = jasmine.createSpy('handler');

    fixture.componentInstance.check.subscribe(handler);
    button.triggerEventHandler('click', undefined);

    expect(handler).toHaveBeenCalled();
  });
});
