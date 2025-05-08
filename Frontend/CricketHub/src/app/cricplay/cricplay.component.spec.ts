import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CricplayComponent } from './cricplay.component';

describe('CricplayComponent', () => {
  let component: CricplayComponent;
  let fixture: ComponentFixture<CricplayComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CricplayComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CricplayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
