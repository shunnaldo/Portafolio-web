import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserGrowthChartComponent } from './user-growth-chart.component';

describe('UserGrowthChartComponent', () => {
  let component: UserGrowthChartComponent;
  let fixture: ComponentFixture<UserGrowthChartComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [UserGrowthChartComponent]
    });
    fixture = TestBed.createComponent(UserGrowthChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
