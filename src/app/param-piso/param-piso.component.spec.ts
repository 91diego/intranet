import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ParamPisoComponent } from './param-piso.component';

describe('ParamPisoComponent', () => {
  let component: ParamPisoComponent;
  let fixture: ComponentFixture<ParamPisoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ParamPisoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ParamPisoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
