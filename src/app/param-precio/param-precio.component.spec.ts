import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ParamPrecioComponent } from './param-precio.component';

describe('ParamPrecioComponent', () => {
  let component: ParamPrecioComponent;
  let fixture: ComponentFixture<ParamPrecioComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ParamPrecioComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ParamPrecioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
