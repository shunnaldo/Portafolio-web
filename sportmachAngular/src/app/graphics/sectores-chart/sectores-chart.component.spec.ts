import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SectoresChartComponent } from './sectores-chart.component';

describe('SectoresChartComponent', () => {
  let component: SectoresChartComponent;
  let fixture: ComponentFixture<SectoresChartComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SectoresChartComponent]
    });
    fixture = TestBed.createComponent(SectoresChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
