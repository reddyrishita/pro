import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FansDashboardComponent } from './fans-dashboard.component';

describe('FansDashboardComponent', () => {
  let component: FansDashboardComponent;
  let fixture: ComponentFixture<FansDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FansDashboardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FansDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
