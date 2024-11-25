import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CellGroupComponent } from './cell-group.component';

describe('GroupComponent', () => {
  let component: CellGroupComponent;
  let fixture: ComponentFixture<CellGroupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CellGroupComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CellGroupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
