import { TestBed } from '@angular/core/testing';

import { SupuestoObraService } from './supuesto-obra.service';

describe('SupuestoObraService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: SupuestoObraService = TestBed.get(SupuestoObraService);
    expect(service).toBeTruthy();
  });
});
