import { TestBed } from '@angular/core/testing';

import { CreatetournamentService } from './createtournament.service';

describe('CreatetournamentService', () => {
  let service: CreatetournamentService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CreatetournamentService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
