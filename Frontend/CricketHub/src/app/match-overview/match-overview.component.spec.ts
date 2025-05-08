import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MatchOverviewComponent } from './match-overview.component';

describe('MatchOverviewComponent', () => {
  let component: MatchOverviewComponent;
  let fixture: ComponentFixture<MatchOverviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MatchOverviewComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MatchOverviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
