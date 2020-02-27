import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ParametrosCalculadoraComponent } from './parametros-calculadora.component';

describe('ParametrosCalculadoraComponent', () => {
  let component: ParametrosCalculadoraComponent;
  let fixture: ComponentFixture<ParametrosCalculadoraComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ParametrosCalculadoraComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ParametrosCalculadoraComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
