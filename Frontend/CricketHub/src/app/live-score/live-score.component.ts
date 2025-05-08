import { CommonModule } from '@angular/common';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';

import { Subscription } from 'rxjs';

interface Commentary {
  ball: string;
  description: string;
  timestamp: Date;
}

@Component({
  selector: 'app-live-score',
  templateUrl: './live-score.component.html',
  styleUrls: ['./live-score.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    
  ],
})
export class LiveScoreComponent implements OnInit, OnDestroy {
  teamA = [
    { playerId: 1, name: 'Player A1', runs: 30, wickets: 0, isBatting: true },
    { playerId: 2, name: 'Player A2', runs: 50, wickets: 1, isBatting: true },
    { playerId: 3, name: 'Player A3', runs: 30, wickets: 0, isBatting: false },
    { playerId: 4, name: 'Player A4', runs: 50, wickets: 1, isBatting: false },
    { playerId: 5, name: 'Player A5', runs: 30, wickets: 0, isBatting: false },
    { playerId: 6, name: 'Player A6', runs: 50, wickets: 1, isBatting: false },
    { playerId: 7, name: 'Player A7', runs: 30, wickets: 0, isBatting: false },
    { playerId: 8, name: 'Player A8', runs: 50, wickets: 1, isBatting: false },
    { playerId: 9, name: 'Player A9', runs: 30, wickets: 0, isBatting: false },
    { playerId: 10, name: 'Player A10', runs: 50, wickets: 1, isBatting: false },
  ];

  teamB = [
    { playerId: 1, name: 'Player B1', runs: 20, wickets: 2, isBatting: false },
    { playerId: 2, name: 'Player B2', runs: 40, wickets: 0, isBatting: false },
    // Add more players as needed
  ];

  battingTeam: 'A' | 'B' = 'A';
  commentary: Commentary[] = [];
  private subscription!: Subscription;

  constructor(private router: Router) {}

  ngOnInit() {
    // Here you would connect to your Kafka WebSocket service
    // For now, we'll simulate updates
    this.simulateKafkaUpdates();
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  private simulateKafkaUpdates() {
    // This would be replaced with your actual Kafka connection
    setInterval(() => {
      this.addNewCommentary();
    }, 5000);
  }

  private addNewCommentary() {
    const newComment: Commentary = {
      ball: `${Math.floor(Math.random() * 20)}.${Math.floor(Math.random() * 6)}`,
      description: this.getRandomCommentary(),
      timestamp: new Date()
    };
    this.commentary = [newComment, ...this.commentary].slice(0, 10);
  }

  private getRandomCommentary(): string {
    const comments = [
      'Beautiful shot through the covers for FOUR!',
      'Clean bowled! The stumps are shattered!',
      'High in the air... and CAUGHT at long-on!',
      'Quick single taken, good running between the wickets',
      'Wide ball signaled by the umpire',
      'Massive SIX over long-off!',
      'Appeal for LBW... NOT OUT says the umpire',
      'Dot ball, good defensive technique',
      'Edge and taken behind the wickets!',
      'Yorker right on the money!'
    ];
    return comments[Math.floor(Math.random() * comments.length)];
  }
} 