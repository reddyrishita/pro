import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { NavbarComponent } from '../navbar/navbar.component';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { MatchService } from '../services/match.service';
import { PlayerService } from '../services/player.service';

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

interface Match {
  id: number;
  winner: string;
  team1: string;
  team2: string;
}

@Component({
  selector: 'app-match-overview',
  templateUrl: './match-overview.component.html',
  styleUrls: ['./match-overview.component.css'],
  standalone: true,
  imports: [CommonModule, NavbarComponent],
})
export class MatchOverviewComponent implements OnInit {
  teamA: Team | null = null;
  teamB: Team | null = null;
  matchId: string = '';
  playerNames: { [key: string]: string } = {};
  winner: string = '';
  teamAPlayerIds: string[] = [];
  teamBPlayerIds: string[] = [];
  match: Match | null = null;

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private matchService: MatchService,
    private playerService: PlayerService
  ) {}

  ngOnInit() {
    this.matchId = this.route.snapshot.queryParams['matchId'];
    this.loadMatchDetails();
    this.loadMatchStats();
  }

  loadMatchDetails() {
    this.http.get<Match>(`http://localhost:8085/api/matches/${this.matchId}`).subscribe({
      next: (match) => {
        this.match = match;
        this.winner = match.winner;
      },
      error: (error) => console.error('Error loading match details:', error)
    });
  }

  loadMatchStats() {
    this.http.get<Team[]>(`http://localhost:8085/api/teams/matchStats/${this.matchId}`).subscribe({
      next: (teams) => {
        teams.forEach(team => {
          if (team.teamName === 'Team A') {
            this.teamA = team;
            this.teamAPlayerIds = Object.keys(team.team);
          } else {
            this.teamB = team;
            this.teamBPlayerIds = Object.keys(team.team);
          }
        });
        this.loadPlayerNames();
      },
      error: (error) => console.error('Error loading match stats:', error)
    });
  }

  loadPlayerNames() {
    if (this.teamA && this.teamB) {
      const playerIds = [...this.teamAPlayerIds, ...this.teamBPlayerIds];
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

  getPlayerName(playerId: string): string {
    return this.playerNames[playerId] || 'Loading...';
  }
}
