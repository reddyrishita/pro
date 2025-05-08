import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Chart, registerables } from 'chart.js';

@Component({
  selector: 'app-admin-users',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section id="users">
      <table>
        <tr>
          <th>UID</th><th>Name</th><th>Email</th><th>Total Runs</th><th>Total Wickets</th><th>Total Matches</th>
        </tr>
        <tr *ngFor="let player of players" (click)="showStats(player)">
          <td>{{ player.userId }}</td><td>{{ player.username }}</td><td>{{ player.email }}</td>
          <td>{{ player.totalRuns }}</td><td>{{ player.totalWickets }}</td><td>{{ player.totalMatches }}</td>
        </tr>
      </table>
      <canvas id="playerChart"></canvas>
    </section>
  `,
  styles: [`table { width: 100%; border-collapse: collapse; } th, td { border: 1px solid #ddd; padding: 10px; }`]
})
export class AdminUsersComponent implements OnInit {
  players = [{ username: 'Virat Kohli', userId: 'VK18', email: 'vk@bcci.com', totalMatches: 250, totalRuns: 12000, totalWickets: 150 }];
  
  ngOnInit() { Chart.register(...registerables); }

  showStats(player: any) {
    const wicketQuotient = (player.totalWickets / player.totalMatches).toFixed(2);
    const runQuotient = (player.totalRuns / player.totalMatches).toFixed(2);
    new Chart(document.getElementById('playerChart') as HTMLCanvasElement, {
      type: 'bar',
      data: { labels: ['Wickets per Match', 'Runs per Match'], datasets: [{ data: [wicketQuotient, runQuotient], backgroundColor: ['blue', 'green'] }] },
      options: { responsive: true }
    });
  }
}
