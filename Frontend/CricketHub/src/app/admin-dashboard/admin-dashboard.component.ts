import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Chart, registerables } from 'chart.js';
import { CommonModule } from '@angular/common';
import { AdminNavbarComponent } from '../admin-navbar/admin-navbar.component';
import { AdminSidebarComponent } from '../admin-sidebar/admin-sidebar.component';
import { AdminUsersComponent } from '../admin-users/admin-users.component';
import { AdminTrainersComponent } from '../admin-trainers/admin-trainers.component';
import { AdminAddTrainerComponent } from '../admin-add-trainer/admin-add-trainer.component';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  templateUrl: './admin-dashboard.component.html',
  imports: [
    CommonModule,
    AdminNavbarComponent,
    AdminSidebarComponent,
    AdminUsersComponent,
    AdminTrainersComponent,
    AdminAddTrainerComponent
  ],
  styleUrls: ['./admin-dashboard.component.css']
})
export class AdminDashboardComponent implements OnInit {
  activeSection: string = 'welcome';

  players = [
    { username: 'Virat Kohli', userId: 'VK18', email: 'vk@bcci.com', totalMatches: 250, totalRuns: 12000, totalWickets: 150 },
    { username: 'MS Dhoni', userId: 'MS07', email: 'ms@bcci.com', totalMatches: 350, totalRuns: 15000, totalWickets: 0 },
    { username: 'Sachin Tendulkar', userId: 'ST10', email: 'st@bcci.com', totalMatches: 450, totalRuns: 18426, totalWickets: 200 }
  ];

  trainers = [
    { name: 'Rahul Dravid', id: 'RD01', experience: 10, email: 'rd@bcci.com', city: 'Bangalore', specialization: 'Batting' },
    { name: 'Anil Kumble', id: 'AK02', experience: 12, email: 'ak@bcci.com', city: 'Bangalore', specialization: 'Bowling' }
  ];

  @ViewChild('playerChartCanvas') playerChartCanvas!: ElementRef;
  playerChart: Chart | undefined;

  ngOnInit() {
    Chart.register(...registerables);
  }

  showSection(section: string) {
    this.activeSection = section;
  }

  showStats(player: any) {
    const ctx = this.playerChartCanvas?.nativeElement?.getContext('2d');
    if (!ctx) return;

    // Ensure data is in number[] format
    const data: number[] = [
      parseFloat((player.totalWickets / player.totalMatches).toFixed(2)), // Convert to number
      parseFloat((player.totalRuns / player.totalMatches).toFixed(2))    // Convert to number
    ];

    if (this.playerChart) {
      this.playerChart.destroy(); // Destroy the previous chart instance
    }

    this.playerChart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: ['Wickets per Match', 'Runs per Match'],
        datasets: [{
          data, // Correct data format
          backgroundColor: ['blue', 'green']
        }]
      },
      options: { responsive: true }
    });
  }

  toggleSidebar() {
    const sidebar = document.getElementById('sidebar');
    if (sidebar) {
      sidebar.style.transform = sidebar.style.transform === 'translateX(0%)' ? 'translateX(-100%)' : 'translateX(0%)';
    }
  }
}
