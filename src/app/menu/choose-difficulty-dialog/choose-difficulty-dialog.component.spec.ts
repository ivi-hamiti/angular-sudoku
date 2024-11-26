import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChooseDifficultyDialogComponent } from './choose-difficulty-dialog.component';
import { MatDialogRef } from '@angular/material/dialog';
import { BoardDifficulty } from '../../app.models';
import { By } from '@angular/platform-browser';

describe('ChooseDifficultyDialogComponent', () => {
  let fixture: ComponentFixture<ChooseDifficultyDialogComponent>;
  let dialogRef: Mock<MatDialogRef<BoardDifficulty>>;

  beforeEach(async () => {
    dialogRef = {
      close: jasmine.createSpy('close'),
      afterOpened: jasmine.createSpy('afterOpened'),
      afterClosed: jasmine.createSpy('afterClosed'),
      beforeClosed: jasmine.createSpy('beforeClosed'),
      backdropClick: jasmine.createSpy('backdropClick'),
      keydownEvents: jasmine.createSpy('keydownEvents'),
      updateSize: jasmine.createSpy('updateSize'),
      updatePosition: jasmine.createSpy('updatePosition'),
      addPanelClass: jasmine.createSpy('addPanelClass'),
      removePanelClass: jasmine.createSpy('removePanelClass'),
      getState: jasmine.createSpy('getState'),
    };

    await TestBed.configureTestingModule({
      imports: [ChooseDifficultyDialogComponent],
      providers: [
        { provide: MatDialogRef<BoardDifficulty>, useValue: dialogRef },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ChooseDifficultyDialogComponent);
    fixture.detectChanges();
  });

  it('should render buttons for every difficulty level', () => {
    const buttons = fixture.debugElement.queryAll(By.css('button'));

    expect(buttons.length).toBe(4);
    expect(buttons[0].nativeElement.textContent.trim()).toBe('Easy');
    expect(buttons[1].nativeElement.textContent.trim()).toBe('Medium');
    expect(buttons[2].nativeElement.textContent.trim()).toBe('Hard');
    expect(buttons[3].nativeElement.textContent.trim()).toBe('Random');
  });

  it('should close the dialog and return the clicked difficulty', () => {
    const buttons = fixture.debugElement.queryAll(By.css('button'));

    dialogRef.close.calls.reset();
    buttons[0].triggerEventHandler('click', undefined);
    expect(dialogRef.close).toHaveBeenCalledWith('easy');

    dialogRef.close.calls.reset();
    buttons[1].triggerEventHandler('click', undefined);
    expect(dialogRef.close).toHaveBeenCalledWith('medium');

    dialogRef.close.calls.reset();
    buttons[2].triggerEventHandler('click', undefined);
    expect(dialogRef.close).toHaveBeenCalledWith('hard');

    dialogRef.close.calls.reset();
    buttons[3].triggerEventHandler('click', undefined);
    expect(dialogRef.close).toHaveBeenCalledWith('random');
  });
});
