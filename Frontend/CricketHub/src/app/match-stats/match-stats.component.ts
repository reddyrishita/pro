import { CommonModule } from '@angular/common'; 
import { Component, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';
import { EditScoreDialogComponent } from '../edit-score-dialog/edit-score-dialog.component';
import { NavbarComponent } from '../navbar/navbar.component';
import { MatchService } from '../services/match.service';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { PlayerService } from '../services/player.service';


interface TeamScore {
  teamScore: number;
  teamWickets: number;
  teamOvers: number;
}

interface Player {
  playerId: number;
  name: string;
  runs: number;
  wickets: number;
  isBatting: boolean;
  isBowling: boolean;
}

interface Team {
  id: number;
  matchId: string;
  team: { [key: string]: number[] };
  teamSize: number;
  teamScore: number;
  teamWickets: number;
  teamName: string;
  userId: string;
  deliviries: number;
  teamOvers: number;
  scoreHistory: any[];
}

@Component({
selector: 'app-match-stats',
templateUrl: './match-stats.component.html',
styleUrls: ['./match-stats.component.css'],
standalone: true,
imports: [
CommonModule,
MatDialogModule,
MatIconModule,
MatButtonModule,
NavbarComponent,
],
})
export class MatchStatsComponent implements OnInit {
  teamA: Team | null = null;
  teamB: Team | null = null;
  battingTeam: 'A' | 'B' = 'A';
  matchId: string = '';
  teamsSelected = false; // Tracks if teams have been selected
  inningsCompleted = false; // Tracks if the innings have been completed
  matchEnded = false; // Tracks if the match has ended
  winner = ''; // Stores the match winner
  matchStarted: boolean = false;
matchStatus: any="Ongoing";
  playerNames: { [key: string]: string } = {};

  constructor(
    private dialog: MatDialog,
    private router: Router,
    private matchService: MatchService,
    private route: ActivatedRoute,
    private http: HttpClient,
    private playerService: PlayerService
  ) {}

  ngOnInit() {
    this.matchId = this.route.snapshot.queryParams['matchId'];
    this.loadMatchStats();
  }

  loadMatchStats() {
    this.http.get<Team[]>(`http://localhost:8085/api/teams/matchStats/${this.matchId}`).subscribe({
      next: (teams) => {
        teams.forEach(team => {
          if (team.teamName === 'Team A') {
            this.teamA = team;
          } else {
            this.teamB = team;
          }
        });
        this.loadPlayerNames();
      },
      error: (error) => console.error('Error loading match stats:', error)
    });
  }

  loadPlayerNames() {
    if (this.teamA && this.teamB) {
      const playerIds = [...Object.keys(this.teamA.team), ...Object.keys(this.teamB.team)];
      
      playerIds.forEach(playerId => {
        this.playerService.getPlayerById(playerId).subscribe({
          next: (player) => {
            this.playerNames[playerId] = player.userName;
          },
          error: (error) => {
            console.error(`Error fetching player name for ID ${playerId}:`, error);
            this.playerNames[playerId] = 'Unknown Player';
          }
        });
      });
    }
  }

  openEditDialog(team: Team, playerId: string, fieldToEdit: 'runs' | 'wickets'): void {
    if (!team.team[playerId]) {
      team.team[playerId] = [0, 0];
    }

    const dialogRef = this.dialog.open(EditScoreDialogComponent, {
      width: '400px',
      data: {
        uid: playerId,
        teamId: team.teamName,
        name: this.playerNames[playerId] || `Player ${playerId}`,
        runs: team.team[playerId][0] || 0,
        wickets: team.team[playerId][1] || 0,
        deliveries: 1
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        const currentRuns = team.team[playerId][0] || 0;
        const currentWickets = team.team[playerId][1] || 0;
        const newRuns = Number(result.runs) || 0;
        const newWickets = Number(result.wickets) || 0;

        // Update player stats based on whether they're batting or bowling
        if (team.teamName === `Team ${this.battingTeam}`) {
          // If it's the batting team, only update runs
          team.team[playerId][0] = Number(currentRuns) + newRuns;
          team.teamScore = Number(team.teamScore || 0) + newRuns;
        } else {
          // If it's the bowling team, update bowler's wickets
          team.team[playerId][1] = Number(currentWickets) + newWickets;
          
          // Update wickets for the batting team
          if (this.battingTeam === 'A' && this.teamA) {
            this.teamA.teamWickets = Number(this.teamA.teamWickets || 0) + newWickets;
          } else if (this.battingTeam === 'B' && this.teamB) {
            this.teamB.teamWickets = Number(this.teamB.teamWickets || 0) + newWickets;
          }
        }
        
        // Update overs for the batting team
        const battingTeam = this.battingTeam === 'A' ? this.teamA : this.teamB;
        if (battingTeam) {
          const currentOvers = Math.floor(battingTeam.teamOvers);
          const currentBalls = Math.round((battingTeam.teamOvers - currentOvers) * 10);
          
          if (currentBalls === 5) {
            battingTeam.teamOvers = currentOvers + 1;
          } else {
            battingTeam.teamOvers = Number((currentOvers + (currentBalls + 1) * 0.1).toFixed(1));
          }
        }

        // Update both teams' scores in the backend
        this.updateTeamScore(team.matchId, 'Team A');
        this.updateTeamScore(team.matchId, 'Team B');
      }
    });
  }

  updateTeamScore(matchId: string, teamName: string) {
    this.http.get<TeamScore>(`http://localhost:8085/api/teams/${matchId}/${teamName}/score`)
      .subscribe({
        next: (score) => {
          if (this.teamA && this.teamA.teamName === teamName) {
            this.teamA.teamScore = score.teamScore;
            this.teamA.teamWickets = score.teamWickets;
            this.teamA.teamOvers = score.teamOvers;
          } else if (this.teamB && this.teamB.teamName === teamName) {
            this.teamB.teamScore = score.teamScore;
            this.teamB.teamWickets = score.teamWickets;
            this.teamB.teamOvers = score.teamOvers;
          }
        },
        error: (error) => console.error('Error updating score:', error)
      });
  }

  // Select teams to start the match
  selectTeams(): void {
    this.battingTeam = this.battingTeam === 'A' ? 'B' : 'A';
    this.teamsSelected = true;
  }

  // Switch innings (batting and bowling)
  switchInnings(): void {
    if (!this.inningsCompleted) {
      this.battingTeam = this.battingTeam === 'A' ? 'B' : 'A';
      this.inningsCompleted = true;
    }
  }

  // Start the match
  startMatch(): void {
    this.matchService.startMatch(Number(this.matchId)).subscribe({
      next: () => {
        this.matchStarted = true;
        this.matchStatus="Ongoing";
        this.router.navigate(['/match-stats'], { queryParams: { matchId: this.matchId } });
      },
      error: (error) => console.error('Error starting match:', error)
    });
  }

  // End the match
  endMatch(): void {
    this.matchService.endMatch(Number(this.matchId)).subscribe({
      next: () => {
        this.matchEnded = true;
        this.matchStatus="Completed";
        this.calculateWinner();
        this.router.navigate(['/organizer-dashboard']);
      },
      error: (error: any) => console.error('Error ending match:', error)
    });
  }

  // Calculate the winner based on scores
  calculateWinner(): void {
    const teamAScore = this.teamA?.teamScore || 0;
    const teamBScore = this.teamB?.teamScore || 0;

    if (teamAScore > teamBScore) {
      this.winner = 'Team A wins!';
    } else if (teamBScore > teamAScore) {
      this.winner = 'Team B wins!';
    } else {
      this.winner = 'It\'s a tie!';
    }
  }

  getPlayerName(playerId: string): string {
    return this.playerNames[playerId] || 'Loading...';
  }
}


