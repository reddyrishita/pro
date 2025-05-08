import { TestBed } from '@angular/core/testing';

import { AdminsignupService } from './adminsignup.service';

describe('AdminsignupService', () => {
  let service: AdminsignupService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AdminsignupService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
