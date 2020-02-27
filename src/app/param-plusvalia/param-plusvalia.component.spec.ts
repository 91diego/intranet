import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ParamPlusvaliaComponent } from './param-plusvalia.component';

describe('ParamPlusvaliaComponent', () => {
  let component: ParamPlusvaliaComponent;
  let fixture: ComponentFixture<ParamPlusvaliaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ParamPlusvaliaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ParamPlusvaliaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
