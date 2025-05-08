import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from '../navbar/navbar.component';
import { MatchService } from '../services/match.service';
import { PlayerService } from '../services/player.service';
import { ActivatedRoute } from '@angular/router';

// Add these interfaces
interface Player {
  userName?: string;
  name?: string;
  // add other player properties as needed
}

interface Team {
  teamName: string;
  team: { [key: string]: any };  // or more specific type if known
}

@Component({
  selector: 'app-registeredplayers',
  standalone: true,
  imports: [CommonModule, NavbarComponent],
  templateUrl: './registeredplayers.component.html',
  styleUrls: ['./registeredplayers.component.css']
})
export class RegisteredplayersComponent implements OnInit {
  teamA: Team = { team: {}, teamName: 'Team A' };
  teamB: Team = { team: {}, teamName: 'Team B' };
  matchId: string = '';
  playerNames: { [key: string]: string } = {};

  constructor(
    private matchService: MatchService,
    private route: ActivatedRoute,
    private playerService: PlayerService
  ) {}

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.matchId = params['matchId'];
      if (this.matchId) {
        this.loadRegisteredPlayers();
      }
    });
  }

  loadRegisteredPlayers() {
    this.matchService.getRegisteredPlayers(this.matchId).subscribe({
      next: (teams: Team[]) => {
        teams.forEach(team => {
          if (team.teamName === 'Team A') {
            this.teamA = team;
          } else if (team.teamName === 'Team B') {
            this.teamB = team;
          }
        });
        this.loadPlayerNames();
      },
      error: (error) => {
        console.error('Error loading registered players:', error);
      }
    });
  }

  getPlayerName(playerId: string): string {
    return this.playerNames[playerId] || 'Loading...';
  }

  loadPlayerNames() {
    if (this.teamA && this.teamB) {
      const playerIds = [...Object.keys(this.teamA.team), ...Object.keys(this.teamB.team)];
      console.log('Player IDs to fetch:', playerIds);
      
      playerIds.forEach(playerId => {
        this.playerService.getPlayerById(playerId).subscribe({
          next: (player: Player) => {
            console.log(`Received player data for ID ${playerId}:`, player);
            this.playerNames[playerId] = player.userName || player.name || 'Unknown';
          },
          error: (error) => {
            console.error(`Error fetching player name for ID ${playerId}:`, error);
            this.playerNames[playerId] = 'Unknown Player';
          }
        });
      });
    }
  }
}
