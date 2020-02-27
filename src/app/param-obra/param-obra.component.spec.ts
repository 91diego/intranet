import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ParamObraComponent } from './param-obra.component';

describe('ParamObraComponent', () => {
  let component: ParamObraComponent;
  let fixture: ComponentFixture<ParamObraComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ParamObraComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ParamObraComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
