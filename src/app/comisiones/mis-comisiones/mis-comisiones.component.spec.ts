import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MisComisionesComponent } from './mis-comisiones.component';

describe('MisComisionesComponent', () => {
  let component: MisComisionesComponent;
  let fixture: ComponentFixture<MisComisionesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MisComisionesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MisComisionesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
