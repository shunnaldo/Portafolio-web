import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeportesChartComponent } from './deportes-chart.component';

describe('DeportesChartComponent', () => {
  let component: DeportesChartComponent;
  let fixture: ComponentFixture<DeportesChartComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DeportesChartComponent]
    });
    fixture = TestBed.createComponent(DeportesChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
