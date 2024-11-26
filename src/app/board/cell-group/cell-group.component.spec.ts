import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CellGroupComponent } from './cell-group.component';
import { Component } from '@angular/core';
import { CellComponent } from '../cell/cell.component';
import { By } from '@angular/platform-browser';
import { BoardCellGroup } from '../../app.models';

describe('CellGroupComponent', () => {
  let fixture: ComponentFixture<CellGroupComponent>;

  const group: BoardCellGroup = [
    { value: 1, prefilled: true, state: 'selected' },
    { value: undefined, state: 'highlighted' },
    { value: undefined, state: 'marked' },
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CellGroupComponent, CellComponent],
    })
      .overrideComponent(CellComponent, { set: { template: '' } })
      .compileComponents();

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
