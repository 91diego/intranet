import { TestBed } from '@angular/core/testing';

import { HojaLlenadoService } from './hoja-llenado.service';

describe('HojaLlenadoService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: HojaLlenadoService = TestBed.get(HojaLlenadoService);
    expect(service).toBeTruthy();
  });
});
