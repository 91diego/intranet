import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ParamMercadoComponent } from './param-mercado.component';

describe('ParamMercadoComponent', () => {
  let component: ParamMercadoComponent;
  let fixture: ComponentFixture<ParamMercadoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ParamMercadoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ParamMercadoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
