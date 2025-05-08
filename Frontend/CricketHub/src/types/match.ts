export enum MatchStatus {
  UPCOMING = 'upcoming',
  ONGOING = 'ongoing',
  COMPLETED = 'completed'
}

export interface Match {
  // ... existing properties ...
  status: MatchStatus;
}
