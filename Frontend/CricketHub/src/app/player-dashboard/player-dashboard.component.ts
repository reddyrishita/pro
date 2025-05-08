import { animate, style, transition, trigger } from '@angular/animations';
import { CommonModule } from '@angular/common';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { MatToolbarModule } from '@angular/material/toolbar';
import { Router } from '@angular/router';
import { NavbarComponent } from '../navbar/navbar.component';
import { PlayerService } from '../services/player.service';
import { MatchService } from '../services/match.service';
import { catchError, forkJoin, of } from 'rxjs';

type Match = {
  groundName: string;
  location: string;
  date: Date;
  id: number;
  code: string;
  image?: string;
};

@Component({
  selector: 'app-player-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatTableModule,
    MatCardModule,
    NavbarComponent,
  ],
  templateUrl: './player-dashboard.component.html',
  styleUrls: ['./player-dashboard.component.css'],
  animations: [
    trigger('fadeIn', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(20px)' }),
        animate('300ms ease-out', style({ opacity: 1, transform: 'translateY(0)' })),
      ]),
    ]),
  ],
})
export class PlayerDashboardComponent implements OnInit, OnDestroy {
  private refreshInterval: any;
  private readonly REFRESH_INTERVAL = 30000; // 30 seconds

  searchCode: string = '';
  isBatting: boolean = true;
  playerData: any = null;
  matches: Match[] = [];
  loading = true;
  error: string | null = null;

  images = [
    'assets/image/player1.avif',
    'assets/image/player2.jpg',
    'assets/image/player3.jpg',
    'assets/image/player4.jpg',
    'assets/image/player5.avif',
  ];

  constructor(
    private router: Router,
    private playerService: PlayerService,
    private matchService: MatchService
  ) {
    this.shuffleImages();
  }

  ngOnInit() {
    // Initial load
    this.loadDashboardData();

    // Set up periodic refresh
    this.refreshInterval = setInterval(() => {
      this.refreshData();
    }, this.REFRESH_INTERVAL);

    // Subscribe to player updates
    this.playerService.currentPlayer$.subscribe(player => {
      if (player) {
        this.playerData = player;
      }
    });
  }

  ngOnDestroy() {
    if (this.refreshInterval) {
      clearInterval(this.refreshInterval);
    }
  }

  private refreshData() {
    this.matchService.getAllMatches().pipe(
      catchError(error => {
        console.error('Error refreshing matches:', error);
        return of([]);
      })
    ).subscribe(matches => {
      if (matches) {
        this.matches = matches;
        localStorage.setItem('matches', JSON.stringify(matches));
        this.assignImagesToCards();
      }
    });
  }

  loadDashboardData() {
    this.loading = true;
    this.error = null;

    forkJoin({
      player: this.playerService.getPlayerDetails().pipe(
        catchError(error => {
          console.error('Error loading player details:', error);
          return of(null);
        })
      ),
      matches: this.matchService.getMatchesByStatus('Upcoming').pipe(
        catchError(error => {
          console.error('Error loading matches:', error);
          return of([]);
        })
      )
    }).subscribe({
      next: (data) => {
        if (data.player) {
          this.playerData = data.player;
          localStorage.setItem('playerData', JSON.stringify(data.player));
        }

        if (data.matches) {
          this.matches = data.matches;
          localStorage.setItem('matches', JSON.stringify(data.matches));
          this.assignImagesToCards();
        }
      },
      error: (error) => {
        console.error('Error loading dashboard data:', error);
        this.error = 'Failed to load dashboard data';
      },
      complete: () => {
        this.loading = false;
      }
    });
  }

  getDisplayedColumns(): string[] {
    return this.isBatting
      ? ['name', 'matchesPlayed', 'highScore', 'totalRuns']
      : ['name', 'matchesPlayed', 'highestWickets', 'totalWickets'];
  }

  onStatisticsChange(event: any): void {
    this.isBatting = event.value === 'batting';
  }


  trackLocation(location: string): void {
    this.matchService.getMatchesByLocation(location).subscribe({
      next: (matches) => {
        console.log('Matches at location:', matches);
      },
      error: (error) => {
        console.error('Error tracking location:', error);
      }
    });
  }

  playerregistration(matchId: number): void {
    localStorage.setItem('matchId', matchId.toString());
    this.router.navigate(['/player-registration']);
  }

  searchMatch(): void {
    if (this.searchCode) {
      this.matchService.getMatchByCode(this.searchCode).subscribe({
        next: (match) => {
          if (match) {
            console.log('Found match:', match);
          } else {
            console.log('Match not found');
          }
        },
        error: (error) => {
          console.error('Error searching match:', error);
        }
      });
    } else {
      console.log('Please enter a match code');
    }
  }

  shuffleImages(): void {
    for (let i = this.images.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [this.images[i], this.images[j]] = [this.images[j], this.images[i]];
    }
  }

  assignImagesToCards(): void {
    let previousImage = '';
    this.matches.forEach((match, index) => {
      let selectedImage;
      do {
        selectedImage = this.images[index % this.images.length];
      } while (selectedImage === previousImage);
      match.image = selectedImage;
      previousImage = selectedImage;
    });
  }
}
