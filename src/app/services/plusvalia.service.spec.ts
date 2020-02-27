import { TestBed } from '@angular/core/testing';

import { PlusvaliaService } from './plusvalia.service';

describe('PlusvaliaService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: PlusvaliaService = TestBed.get(PlusvaliaService);
    expect(service).toBeTruthy();
  });
});
