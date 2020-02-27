import { TestBed } from '@angular/core/testing';

import { SupuestoMercadoService } from './supuesto-mercado.service';

describe('SupuestoMercadoService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: SupuestoMercadoService = TestBed.get(SupuestoMercadoService);
    expect(service).toBeTruthy();
  });
});
