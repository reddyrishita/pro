import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-admin-navbar',
  standalone: true,
  imports: [CommonModule,RouterModule],
  template: `
    <nav class="navbar">
      <img src="assets/admin-profile.jpg" class="profile-photo" alt="Admin">
      <button (click)="toggleSidebar()" class="hamburger">☰</button>
      <button class="logout">Logout</button>
    </nav>
  `,
  styles: [`
    .navbar { display: flex; justify-content: space-between; align-items: center; background: #222; color: white; padding: 10px 20px; }
    .profile-photo { width: 40px; height: 40px; border-radius: 50%; }
    .hamburger, .logout { background: none; border: none; color: white; font-size: 18px; cursor: pointer; }
  `]
})
export class AdminNavbarComponent {
  router: any;
  toggleSidebar() {
    document.querySelector('.sidebar')?.classList.toggle('open');
    this.router.navigate(['/admin-sidebar']);
  }
}
