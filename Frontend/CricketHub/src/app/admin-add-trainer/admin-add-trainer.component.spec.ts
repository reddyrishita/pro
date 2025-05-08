import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminAddTrainerComponent } from './admin-add-trainer.component';

describe('AdminAddTrainerComponent', () => {
  let component: AdminAddTrainerComponent;
  let fixture: ComponentFixture<AdminAddTrainerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminAddTrainerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminAddTrainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
