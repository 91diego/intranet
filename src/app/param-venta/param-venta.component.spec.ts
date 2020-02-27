import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ParamVentaComponent } from './param-venta.component';

describe('ParamVentaComponent', () => {
  let component: ParamVentaComponent;
  let fixture: ComponentFixture<ParamVentaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ParamVentaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ParamVentaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
