import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClubMembersChartComponent } from './club-members-chart.component';

describe('ClubMembersChartComponent', () => {
  let component: ClubMembersChartComponent;
  let fixture: ComponentFixture<ClubMembersChartComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ClubMembersChartComponent]
    });
    fixture = TestBed.createComponent(ClubMembersChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
