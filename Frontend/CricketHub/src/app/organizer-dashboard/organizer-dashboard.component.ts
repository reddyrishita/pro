import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { NavbarComponent } from '../navbar/navbar.component';
import { OrganizeService } from '../services/organize.service';
import { MatchService } from '../services/match.service';

type Match = {
  location: string;
  date: Date;
  status: string;
  image?: string; // Add image property
  id: number;
};

@Component({
  selector: 'app-organizer-dashboard',
  templateUrl: './organizer-dashboard.component.html',
  styleUrls: ['./organizer-dashboard.component.css'],
  imports: [CommonModule, FormsModule, NavbarComponent],
})
export class OrganizerDashboardComponent implements OnInit {
  organizer = {
    userId: '',
    name: '',
    matchesOrganized: 0,
    sponsors: 0,
    supportStaff: 0,
  };
  
  matches: Match[] = [];
  
  images = [
    'assets/image/org1.png',
    'assets/image/org2.png',
    'assets/image/org3.png',
    'assets/image/org4.jpg',
    'assets/image/org5.png',
    'assets/image/org6.png',
    'assets/image/org7.png',
  ];

  constructor(
    private router: Router,
    private organizeService: OrganizeService,
    private matchService: MatchService
  ) {
    this.shuffleImages();
  }
  

  ngOnInit(): void {
    // Get userId from authentication service or localStorage
    const userId = localStorage.getItem('userId') || '';
    
    // Fetch organizer details
    this.organizeService.getOrganizerDetails(userId).subscribe({
      next: (data) => {
        this.organizer = {
          userId: data.userId,
          name: data.userName,
          matchesOrganized: data.numberOfMatchesOrganized,
          sponsors: data.sponsors,
          supportStaff: data.supportStaff
        };
      },
      error: (error) => console.error('Error fetching organizer details:', error)
    });

    // Fetch organizer's matches
    this.organizeService.getOrganizerMatches(userId).subscribe({
      next: (matches) => {
        this.matches = matches.map(match => ({
          location: match.location,
          date: new Date(match.date),
          status: match.status,
          id: match.id
        }));

        this.assignImagesToCards();
      },
      error: (error) => console.error('Error fetching matches:', error)
    });
  }
  
  handleStatusClick(match: Match): void {
    if (match.status === 'Upcoming') {
      // Call API to start match and subscribe to the response
      this.matchService.startMatch(match.id).subscribe({
        next: (updatedMatch) => {
          console.log('Match started successfully:', updatedMatch);
          // Update the local match status
          match.status = 'Ongoing';
          this.router.navigate(['/matchStats'], { queryParams: { matchId: match.id } });
        },
        error: (error) => {
          console.error('Error starting match:', error);
          alert('Failed to start match. Please try again.');
        }
      });
    }
  }
  
  handleOverviewClick(match: Match): void {
    if (match.status !== 'Completed') {
      alert('Match has not ended yet!');
    } else {
      this.router.navigate(['/match-overview'], { queryParams: { matchId: match.id } });
    }
  }
  
  getRegisteredPlayers(match: Match) {
    this.router.navigate(['/registered-players'], { 
      queryParams: { matchId: match.id.toString() }
    });
  }
  // New Method for Redirecting to Create Tournament Page
  navigateToCreateTournament(): void {
    this.router.navigate(['/create-tournament']);
  }
  
  shuffleImages(): void {
    // Shuffle the images array to ensure randomness
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
