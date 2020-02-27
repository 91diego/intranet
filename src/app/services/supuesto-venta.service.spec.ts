import { TestBed } from '@angular/core/testing';

import { SupuestoVentaService } from './supuesto-venta.service';

describe('SupuestoVentaService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: SupuestoVentaService = TestBed.get(SupuestoVentaService);
    expect(service).toBeTruthy();
  });
});
