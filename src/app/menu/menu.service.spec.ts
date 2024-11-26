import { TestBed } from '@angular/core/testing';

import { MatDialog } from '@angular/material/dialog';
import { ChooseDifficultyDialogComponent } from './choose-difficulty-dialog/choose-difficulty-dialog.component';
import { MenuService } from './menu.service';

describe('MenuService', () => {
  let service: MenuService;

  let dialog = {
    open: jasmine.createSpy('open'),
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [{ provide: MatDialog, useValue: dialog }],
    });

    service = TestBed.inject(MenuService);
  });

  it('should open dialog with specified options', () => {
    dialog.open.calls.reset();
    service.openDifficultyChooser();
    expect(dialog.open).toHaveBeenCalledWith(ChooseDifficultyDialogComponent, {
      width: '480px',
    });

    dialog.open.calls.reset();
    service.openDifficultyChooser({ disableClose: true });
    expect(dialog.open).toHaveBeenCalledWith(ChooseDifficultyDialogComponent, {
      disableClose: true,
      width: '480px',
    });
  });
});
