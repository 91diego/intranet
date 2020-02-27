import { TestBed } from '@angular/core/testing';

import { PrototipoService } from './prototipo.service';

describe('PrototipoService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: PrototipoService = TestBed.get(PrototipoService);
    expect(service).toBeTruthy();
  });
});
