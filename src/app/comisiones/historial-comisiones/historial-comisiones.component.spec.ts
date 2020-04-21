import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HistorialComisionesComponent } from './historial-comisiones.component';

describe('HistorialComisionesComponent', () => {
  let component: HistorialComisionesComponent;
  let fixture: ComponentFixture<HistorialComisionesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HistorialComisionesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HistorialComisionesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
