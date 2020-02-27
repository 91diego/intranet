import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ParamCodigosComponent } from './param-codigos.component';

describe('ParamCodigosComponent', () => {
  let component: ParamCodigosComponent;
  let fixture: ComponentFixture<ParamCodigosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ParamCodigosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ParamCodigosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
