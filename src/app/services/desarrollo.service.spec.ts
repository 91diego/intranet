import { TestBed } from '@angular/core/testing';

import { DesarrolloService } from './desarrollo.service';

describe('DesarrolloService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: DesarrolloService = TestBed.get(DesarrolloService);
    expect(service).toBeTruthy();
  });
});
