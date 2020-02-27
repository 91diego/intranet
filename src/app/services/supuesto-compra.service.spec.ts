import { TestBed } from '@angular/core/testing';

import { SupuestoCompraService } from './supuesto-compra.service';

describe('SupuestoCompraService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: SupuestoCompraService = TestBed.get(SupuestoCompraService);
    expect(service).toBeTruthy();
  });
});
