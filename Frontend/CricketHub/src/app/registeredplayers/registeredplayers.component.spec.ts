import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegisteredplayersComponent } from './registeredplayers.component';

describe('RegisteredplayersComponent', () => {
  let component: RegisteredplayersComponent;
  let fixture: ComponentFixture<RegisteredplayersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RegisteredplayersComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RegisteredplayersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
