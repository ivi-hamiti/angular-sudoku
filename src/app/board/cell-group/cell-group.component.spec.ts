import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CellGroupComponent } from './cell-group.component';
import { Component } from '@angular/core';
import { CellComponent } from '../cell/cell.component';
import { By } from '@angular/platform-browser';
import { BoardGroup } from '../../app.models';

describe('CellGroupComponent', () => {
  let fixture: ComponentFixture<CellGroupComponent>;

  const group: BoardGroup = {
    x: 0,
    y: 0,
    cells: [
      { x: 0, y: 0, value: 1, prefilled: true, state: 'selected' },
      { x: 1, y: 0, value: undefined, state: 'highlighted' },
      { x: 2, y: 0, value: undefined, state: 'marked' },
    ],
  };

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

    expect(cells.length).toBe(group.cells.length);

    for (const [index, cell] of group.cells.entries()) {
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

    expect(handler).toHaveBeenCalledWith(group.cells[2]);
  });
});
