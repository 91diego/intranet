import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ParamHipotecarioComponent } from './param-hipotecario.component';

describe('ParamHipotecarioComponent', () => {
  let component: ParamHipotecarioComponent;
  let fixture: ComponentFixture<ParamHipotecarioComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ParamHipotecarioComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ParamHipotecarioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
