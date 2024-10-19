import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SportChartComponent } from './sport-chart.component';

describe('SportChartComponent', () => {
  let component: SportChartComponent;
  let fixture: ComponentFixture<SportChartComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SportChartComponent]
    });
    fixture = TestBed.createComponent(SportChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
