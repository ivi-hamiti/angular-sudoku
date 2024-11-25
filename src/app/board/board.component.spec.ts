import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BoardComponent } from './board.component';
import { Board, BoardGroup, Cell } from '../app.models';
import { CellGroupComponent } from './cell-group/cell-group.component';
import { By } from '@angular/platform-browser';

describe('BoardComponent', () => {
  let fixture: ComponentFixture<BoardComponent>;

  const groups: BoardGroup[] = [
    {
      x: 0,
      y: 0,
      cells: [
        { x: 0, y: 0, value: 1, prefilled: true, state: 'selected' },
        { x: 1, y: 0, value: undefined, state: 'highlighted' },
        { x: 2, y: 0, value: undefined, state: 'marked' },
      ],
    },
    {
      x: 1,
      y: 0,
      cells: [
        { x: 3, y: 0, value: 2 },
        { x: 4, y: 0, value: undefined },
        { x: 5, y: 0, value: undefined },
      ],
    },
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BoardComponent, CellGroupComponent],
    })
      .overrideComponent(CellGroupComponent, { set: { template: '' } })
      .compileComponents();

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
      x: 4,
      y: 0,
      value: undefined,
    });

    expect(handler).toHaveBeenCalledWith({
      cell: { x: 4, y: 0, value: undefined },
      group: groups[1],
    });
  });
});
