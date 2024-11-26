import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Component, input } from '@angular/core';
import { By } from '@angular/platform-browser';
import { BoardCellGroup, BoardCellState, Cell } from '../../app.models';
import { CellComponent } from '../cell/cell.component';
import { CellGroupComponent } from './cell-group.component';

@Component({
  selector: 'app-cell',
  template: ``,
})
class MockCellComponent {
  value = input<Cell>();
  state = input<BoardCellState>();
  prefilled = input<boolean>();
}

describe('CellGroupComponent', () => {
  let fixture: ComponentFixture<CellGroupComponent>;

  const group: BoardCellGroup = [
    { value: 1, prefilled: true, state: 'selected' },
    { value: undefined, state: 'highlighted' },
    { value: undefined, state: 'marked' },
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CellGroupComponent, MockCellComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CellGroupComponent);

    fixture.componentRef.setInput('group', group);
    fixture.detectChanges();
  });

  it('should render cells', () => {
    const cells = fixture.debugElement.queryAll(By.directive(CellComponent));

    expect(cells.length).toBe(group.length);

    for (const [index, cell] of group.entries()) {
      expect(cells[index].componentInstance.value()).toBe(cell.value);
      expect(cells[index].componentInstance.prefilled()).toBe(cell.prefilled);
      expect(cells[index].componentInstance.state()).toBe(cell.state);
    }
  });

  it('should trigger select event when a cell is clicked', () => {
    const cells = fixture.debugElement.queryAll(By.directive(CellComponent));
    const handler = jasmine.createSpy('handler');

    fixture.componentInstance.select.subscribe(handler);

    cells[2].triggerEventHandler('click', null);

    expect(handler).toHaveBeenCalledWith({ cell: group[2], cellIndex: 2 });
  });
});
