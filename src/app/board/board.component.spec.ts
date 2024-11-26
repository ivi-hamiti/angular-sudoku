import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Component, input, output } from '@angular/core';
import { By } from '@angular/platform-browser';
import { BoardCellGroup } from '../app.models';
import { BoardComponent } from './board.component';
import {
  CellGroupComponent,
  CellGroupSelectEvent,
} from './cell-group/cell-group.component';

@Component({
  selector: 'app-cell-group',
  template: ``,
})
class MockCellGroupComponent {
  group = input.required<BoardCellGroup>();
  select = output<CellGroupSelectEvent>();
}

describe('BoardComponent', () => {
  let fixture: ComponentFixture<BoardComponent>;

  const groups: BoardCellGroup[] = [
    [
      { value: 1, prefilled: true, state: 'selected' },
      { value: undefined, state: 'highlighted' },
      { value: undefined, state: 'marked' },
    ],
    [{ value: 2 }, { value: undefined }, { value: undefined }],
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BoardComponent, MockCellGroupComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(BoardComponent);

    fixture.componentRef.setInput('groups', groups);
    fixture.detectChanges();
  });

  it('should render cell groups', () => {
    const cellGroups = fixture.debugElement.queryAll(
      By.directive(CellGroupComponent)
    );

    expect(cellGroups.length).toBe(groups.length);

    for (const [index, group] of groups.entries()) {
      expect(cellGroups[index].componentInstance.group()).toBe(group);
    }
  });

  it('should trigger selected event when a cell group is clicked cell', () => {
    const cellGroups = fixture.debugElement.queryAll(
      By.directive(CellGroupComponent)
    );

    const handler = jasmine.createSpy('handler');

    fixture.componentInstance.select.subscribe(handler);

    cellGroups[1].triggerEventHandler('select', {
      cell: {
        value: undefined,
      },
      cellIndex: 2,
    });

    expect(handler).toHaveBeenCalledWith({
      cell: {
        value: undefined,
      },
      cellIndex: 2,
      group: groups[1],
      groupIndex: 1,
    });
  });
});
