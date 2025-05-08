import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router'; // Import Router
import { NavbarComponent } from '../navbar/navbar.component';
import { MatchService } from '../services/match.service';

// Define the interface for match objects
interface Match {
  id: number;
  type: 'Ongoing' | 'Upcoming' | 'Completed'; // Enforce match types
  name: string;
  location: string;
  date: string;
  image?: string; // Add image property (optional)
  status: string;
}

@Component({
  selector: 'app-fans-dashboard',
  templateUrl: './fans-dashboard.component.html',
  styleUrls: ['./fans-dashboard.component.css'],
  standalone: true,
  imports: [CommonModule, NavbarComponent],
})
export class FansDashboardComponent implements OnInit {
  matches: Match[] = [];
  activeTab: 'Upcoming' | 'Ongoing' | 'Completed' = 'Upcoming';

  constructor(private router: Router, private matchService: MatchService) {
    this.assignRandomImages();
  }

  ngOnInit() {
    this.loadMatches();
  }

  loadMatches() {
    this.matchService.getAllMatches().subscribe({
      next: (matches) => {
        this.matches = matches;
      },
      error: (error) => console.error('Error loading matches:', error)
    });
  }

  // Map match types to multiple images
  matchImages = {
    Ongoing: ['assets/image/live1.jpg', 'assets/image/live2.jpg', 'assets/image/live3.avif', 'assets/image/live4.avif', 'assets/image/live5.jpg'],
    Upcoming: ['assets/image/upc1.webp', 'assets/image/upc2.webp', 'assets/image/upc3.webp', 'assets/image/upc4.webp'],
    Completed: ['assets/image/comp1.webp', 'assets/image/comp2.webp', 'assets/image/comp3.webp', 'assets/image/comp4.webp']
  };

  // Get filtered matches based on active tab
  get filteredMatches() {
    return this.matches.filter(match => match.status === this.activeTab);
  }

  // Assign random images from the available set and ensure no two consecutive images are the same
  assignRandomImages() {
    this.filteredMatches.forEach((match, index) => {
      let randomIndex: number;
      do {
        randomIndex = Math.floor(Math.random() * this.matchImages[this.activeTab].length);
      } while (index > 0 && this.matchImages[this.activeTab][randomIndex] === this.matchImages[this.activeTab][index - 1]);
      match.image = this.matchImages[this.activeTab][randomIndex]; // Assign image
    });
  }

  // Calculate the days left for upcoming matches
  calculateDaysLeft(date: string): number {
    const matchDate = new Date(date);
    const currentDate = new Date();
    return Math.ceil((matchDate.getTime() - currentDate.getTime()) / (1000 * 60 * 60 * 24));
  }

  // Navigate to match overview
  goToOverview() {
    this.router.navigate(['/match-overview']);
  }

  handleMatchAction(match: Match) {
    if (match.status === 'Ongoing') {
      this.router.navigate(['/live-score'], { queryParams: { matchId: match.id } });
    } else if (match.status === 'Completed') {
      this.router.navigate(['/match-overview'], { queryParams: { matchId: match.id } });
    }
  }
}
