import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AutorizarComisionesComponent } from './autorizar-comisiones.component';

describe('AutorizarComisionesComponent', () => {
  let component: AutorizarComisionesComponent;
  let fixture: ComponentFixture<AutorizarComisionesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AutorizarComisionesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AutorizarComisionesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
