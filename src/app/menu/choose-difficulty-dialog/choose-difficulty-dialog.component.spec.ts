import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChooseDifficultyDialogComponent } from './choose-difficulty-dialog.component';

describe('ChooseDifficultyDialogComponent', () => {
  let component: ChooseDifficultyDialogComponent;
  let fixture: ComponentFixture<ChooseDifficultyDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChooseDifficultyDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChooseDifficultyDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
