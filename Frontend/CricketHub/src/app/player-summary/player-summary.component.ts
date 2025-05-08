import { Component, OnInit } from '@angular/core';
import { Chart, registerables } from 'chart.js';
import { NavbarComponent } from "../navbar/navbar.component";

@Component({
  selector: 'app-player-summary',
  standalone: true,
  template: `
  <app-navbar></app-navbar>
  <div class="player-summary">
    <div class="player-summary-container">
      <div class="player-table-container">
        <h1>Player Summary</h1>
        <table class="player-table">
          <thead>
            <tr>
              <th>Username</th>
              <th>User ID</th>
              <th>Total Matches</th>
              <th>Total Runs</th>
              <th>Total Wickets</th>
              <th>Highest Runs</th>
              <th>Highest Wickets</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>{{ playerData.username }}</td>
              <td>{{ playerData.userId }}</td>
              <td>{{ playerData.totalMatches }}</td>
              <td>{{ playerData.totalRuns }}</td>
              <td>{{ playerData.totalWickets }}</td>
              <td>{{ playerData.highestRuns }}</td>
              <td>{{ playerData.highestWickets }}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="graph-container">
        <h2>Player Performance Summary</h2>
        <canvas id="playerChart"></canvas>
      </div>
    </div>
    </div>
  `,
  styles: [
    `
      
      
      .player-summary{
        
        background: linear-gradient(135deg, #67b4d3, #fbe5d6);
        
      }.player-summary-container {
        display: flex;
        flex-direction: column;
        align-items: center;
        font-family: 'Arial', sans-serif;
        margin: 20px;
        padding: 10px;
      }

      .player-table-container {
        margin-bottom: 20px;
        text-align: center;
      }

      .player-table-container h1 {
        font-size: 1.8rem;
        margin-bottom: 10px;
        color: #444;
      }

      .player-table {
        width: 100%;
        max-width: 800px;
        border-collapse: collapse;
        margin: 0 auto;
        background: linear-gradient(135deg, #fbe5d6, #67b4d3);
        border-radius: 8px;
        overflow: hidden;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
        text-align: center;
      }

      .player-table th,
      .player-table td {
        padding: 12px 15px;
        font-size: 1rem;
        color: #333;
      }

      .player-table th {
        background-color: #444;
        color: #fff;
        text-transform: uppercase;
        letter-spacing: 0.05em;
        font-size: 0.9rem;
      }

      .player-table tbody tr {
        background-color: rgba(255, 255, 255, 0.7);
      }

      .player-table tbody tr:hover {
        background-color: rgba(230, 230, 230, 0.9);
        cursor:pointer;
      }

      .graph-container {
        width: 80%;
        max-width: 600px;
        background: #fff;
        padding: 20px;
        border-radius: 12px;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
        text-align: center;
      }

      .graph-container h2 {
        font-size: 1.5rem;
        margin-bottom: 20px;
        color: #444;
      }

      canvas {
        margin-top: 10px;
      }
    `,
  ],
  imports: [NavbarComponent],
})
export class PlayerSummaryComponent implements OnInit {
  playerData = {
    username: 'Virat Kohli',
    userId: 'VK18',
    totalMatches: 250,
    totalRuns: 12000,
    totalWickets: 150,
    highestRuns: 183,
    highestWickets: 6,
  };

  ngOnInit() {
    Chart.register(...registerables);
    this.generateBarGraph();
  }

  generateBarGraph() {
    const wicketQuotient =
      this.playerData.totalWickets / this.playerData.totalMatches;
    const runQuotient =
      this.playerData.totalRuns / this.playerData.totalMatches;

    const ctx = document.getElementById('playerChart') as HTMLCanvasElement;
    new Chart(ctx, {
      type: 'bar',
      data: {
        labels: ['Wickets per Match', 'Runs per Match'],
        datasets: [
          {
            label: 'Performance Metrics',
            data: [wicketQuotient.toFixed(2), runQuotient.toFixed(2)],
            backgroundColor: ['#67b4d3', '#fbe5d6'],
            borderColor: ['#4e94b0', '#d6b39c'],
            borderWidth: 2,
          },
        ],
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: 'top',
          },
          tooltip: {
            callbacks: {
              label: function (context: any) {
                return `${context.label}: ${context.raw}%`;
              },
            },
          },
        },
        scales: {
          y: {
            beginAtZero: true,
            title: {
              display: true,
              text: 'Percentage (%)',
            },
          },
        },
      },
    });
  }
}
