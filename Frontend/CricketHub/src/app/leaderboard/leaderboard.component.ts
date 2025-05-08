import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NavbarComponent } from '../navbar/navbar.component';

@Component({
  selector: 'app-leaderboard',
  standalone: true,
  imports: [CommonModule, FormsModule, NavbarComponent],
  template: `

    <app-navbar></app-navbar>
    <div class="registration-container">

      <div class="container">
        <h1 class="text-center">Leaderboard</h1>
        <div class="filter mb-4 d-flex justify-content-end align-items-center gap-2">
          <label for="filter" class="form-label m-0">Sort By:</label>
          <select
          id="filter"
          [(ngModel)]="selectedFilter"
          (change)="sortLeaderboard()"
          class="form-select w-auto"
        >
        <option value="runs">Leaderboard by Runs</option>
        <option value="wickets">Leaderboard by Wickets</option>
        </select>
      </div>
      <table class="table table-hover table-bordered">
        <thead class="table-dark">
          <tr>
            <th scope="col">UID</th>
            <th scope="col">Player Name</th>
            <th scope="col">Total Runs</th>
            <th scope="col">Total Wickets</th>
          </tr>
        </thead>
        <tbody>
          <tr *ngFor="let player of leaderboard" class="align-middle">
            <td>{{ player.uid }}</td>
            <td>{{ player.name }}</td>
            <td>{{ player.runs }}</td>
            <td>{{ player.wickets }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
  `,
  styles: [

    
    `
    body {
  font-family: 'Arial', sans-serif;
  margin: 0;
  padding: 0;
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: linear-gradient(135deg, #f5f7fa, #c3cfe2);
}

.registration-container {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background: linear-gradient(135deg, #f5f7fa, #c3cfe2);
  font-family: Arial, sans-serif;
  padding: 20px;
}
      .container {
        max-width: 800px;
        margin: 2rem auto;
        padding: 1rem;
        background-color: white;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        border-radius: 8px;
      }
      h1 {
        font-size: 1.8rem;
        color: #333;
        margin-bottom: 1rem;
      }
      .form-select {
        font-size: 1rem;
        padding: 0.5rem;
      }
      table {
        margin-top: 1rem;
      }
      tr:hover {
        background-color: #f8f9fa !important;
        cursor: pointer;
      }
    `,
  ],
})
export class LeaderboardComponent {
  leaderboard = [
    { uid: 1, name: 'Player A', runs: 450, wickets: 20 },
    { uid: 2, name: 'Player B', runs: 520, wickets: 15 },
    { uid: 3, name: 'Player C', runs: 310, wickets: 25 },
    { uid: 4, name: 'Player D', runs: 470, wickets: 10 },
    { uid: 5, name: 'Player E', runs: 390, wickets: 30 },
  ];

  selectedFilter = 'runs';

  sortLeaderboard() {
    if (this.selectedFilter === 'runs') {
      this.leaderboard.sort((a, b) => b.runs - a.runs);
    } else if (this.selectedFilter === 'wickets') {
      this.leaderboard.sort((a, b) => b.wickets - a.wickets);
    }
  }
}
