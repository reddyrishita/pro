import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { OrganizerDashboardComponent } from './organizer-dashboard/organizer-dashboard.component'; // Import OrganizerDashboardComponent
import { PlayerDashboardComponent } from './player-dashboard/player-dashboard.component';
import { PlayerRegistrationComponent } from './player-registration/player-registration.component';
import { RegisterComponent } from './register/register.component';
// import { StartMatchComponent } from './start-match/start-match.component'; // Import StartMatchComponent
import { AdminLoginComponent } from './adminlogin/adminlogin.component';
import { CreateTournamentComponent } from './create-tournament/create-tournament.component';
import { CricplayComponent } from './cricplay/cricplay.component';
import { FansDashboardComponent } from './fans-dashboard/fans-dashboard.component';
import { LeaderboardComponent } from './leaderboard/leaderboard.component';
import { MatchOverviewComponent } from './match-overview/match-overview.component'; // Import MatchOverviewComponent
import { MatchStatsComponent } from './match-stats/match-stats.component';
import { TrainingComponent } from './training/training.component';

import { AdminsignupComponent } from './adminsignup/adminsignup.component';
import { PlayerSummaryComponent } from './player-summary/player-summary.component';
import { RegisteredplayersComponent } from './registeredplayers/registeredplayers.component';
import { LiveScoreComponent } from './live-score/live-score.component';

export const routes: Routes = [
  { path: '', redirectTo: 'crickplay', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'home', component: HomeComponent },
  { path: 'player-dashboard', component: PlayerDashboardComponent },
  { path: 'player-registration', component: PlayerRegistrationComponent },
  { path: 'matchStats',component: MatchStatsComponent },
  { path: 'adminsignup',component: AdminsignupComponent },

  // New routes for organizer dashboard and match components
  { path: 'organizer-dashboard', component: OrganizerDashboardComponent },
  // { path: 'start-match', component: StartMatchComponent },
  { path: 'match-overview', component: MatchOverviewComponent },
  { path: 'create-tournament', component: CreateTournamentComponent },
  { path: 'training', component: TrainingComponent },
  { path: 'crickplay', component:CricplayComponent },
  { path: 'leaderboard',component: LeaderboardComponent },
  { path: 'adminlogin', component: AdminLoginComponent },
  { path: 'player-summary',component: PlayerSummaryComponent},
  { path: 'fans-dashboard',component: FansDashboardComponent},
  { path: 'registered-players', component: RegisteredplayersComponent },
  { path: 'match-stats', component: MatchStatsComponent },
  { path: 'live-score', component: LiveScoreComponent },
];
