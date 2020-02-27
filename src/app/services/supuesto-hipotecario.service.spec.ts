import { TestBed } from '@angular/core/testing';

import { SupuestoHipotecarioService } from './supuesto-hipotecario.service';

describe('SupuestoHipotecarioService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: SupuestoHipotecarioService = TestBed.get(SupuestoHipotecarioService);
    expect(service).toBeTruthy();
  });
});
