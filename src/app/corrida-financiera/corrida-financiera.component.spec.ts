import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CorridaFinancieraComponent } from './corrida-financiera.component';

describe('CorridaFinancieraComponent', () => {
  let component: CorridaFinancieraComponent;
  let fixture: ComponentFixture<CorridaFinancieraComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CorridaFinancieraComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CorridaFinancieraComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
