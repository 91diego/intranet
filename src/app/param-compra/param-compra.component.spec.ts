import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ParamCompraComponent } from './param-compra.component';

describe('ParamCompraComponent', () => {
  let component: ParamCompraComponent;
  let fixture: ComponentFixture<ParamCompraComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ParamCompraComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ParamCompraComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
