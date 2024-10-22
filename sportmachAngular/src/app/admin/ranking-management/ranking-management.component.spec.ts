import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RankingManagementComponent } from './ranking-management.component';

describe('RankingManagementComponent', () => {
  let component: RankingManagementComponent;
  let fixture: ComponentFixture<RankingManagementComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RankingManagementComponent]
    });
    fixture = TestBed.createComponent(RankingManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
