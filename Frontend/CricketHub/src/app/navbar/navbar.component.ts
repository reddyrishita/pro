import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <nav>
      <div class="logo">
        <img src="assets/image/logo.png" alt="Logo" />
        <span class="cricplay">
          <span class="cric">CRIC</span><span class="play">PLAY</span>
        </span>
      </div>
      <div class="navbar-right">
        <a routerLink="/player-summary" class="navbar-link">Player Profile</a>
      </div>
      <ul>
        
        <li><a [class.active]="isActive('/home')" (click)="home()">Home</a></li>
        <li><a [class.active]="isActive('/player-dashboard')" (click)="player()">Play</a></li>
        <li><a [class.active]="isActive('/organizer-dashboard')" (click)="organize()">Organize</a></li>
        <li><a [class.active]="isActive('/fans-dashboard')" (click)="fans()">Live</a></li>
        <li><a [class.active]="isActive('/training')" (click)="train()">Training</a></li>
        <li><a [class.active]="isActive('/leaderboard')" (click)="leaderboard()">leaderboard</a></li>
        <li><a [class.active]="isActive('/login')" (click)="logout()" class="logout">Logout</a></li>
      </ul>
    </nav>
  `,
  styles: [
    `
      nav {
  background-color: #fff;
  border-bottom: 2px solid rgb(247, 246, 248);
  padding: 1.2rem 1rem;
  display: flex;
  align-items: center;
  position: relative;
}

.logo {
  position: absolute;
  top: 0;
  left: 0;
  padding: 0.5rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.logo img {
  height: 35px;
  width: auto;
}

.cricplay {
  font-size: 1.5rem;
  font-weight: bold;
  display: flex;
}

.cric {
  animation: cric-color-swap 2s infinite;
}

.play {
  animation: play-color-swap 2s infinite;
}

/* Pushes "Player Profile" to the right side */
.navbar-right {
  margin-left: auto; /* This pushes the navbar-right section to the right */
  display: flex;
  align-items: center;
}

.navbar-right .navbar-link {
  color:rgb(2, 1, 14);
  text-decoration: none;
  font-size: 1rem;
  margin-right: 10px;
}

.navbar-right .navbar-link:hover {
  color:rgb(21, 24, 243);
}

@keyframes cric-color-swap {
  0%,
  50% {
    color: red;
  }
  50.01%,
  100% {
    color: black;
  }
}

@keyframes play-color-swap {
  0%,
  50% {
    color: black;
  }
  50.01%,
  100% {
    color: red;
  }
}

ul {
  list-style: none;
  margin: 0 auto;
  padding: 0;
  display: flex;
  gap: 1.5rem;
  justify-content: center;
}

li {
  display: inline;
}

a {
  text-decoration: none;
  color: #000;
  font-size: 1rem;
  transition: color 0.3s, transform 0.2s;
  cursor: default;
}

a:hover {
  color: #007bff;
  transform: scale(1.1);
  cursor: pointer;
}

.logout {
  color: red;
  font-weight: bold;
}

.active {
  font-weight: bold;
  text-decoration: none;
  color: #007bff;
}

    `,
  ],
})
export class NavbarComponent {

leaderboard() {
  this.router.navigate(['/leaderboard']);
}
  constructor(private router: Router) {}

  train() {
    this.router.navigate(['/training']);
  }

  home() {
    this.router.navigate(['/home']);
  }

  fans() {
    this.router.navigate(['/fans-dashboard']);
  }

  organize() {
    this.router.navigate(['/organizer-dashboard']);
  }

  player() {
    this.router.navigate(['/player-dashboard']);
  }

  logout() {
    localStorage.clear();
    this.router.navigate(['login']);
    // localStorage.removeItem('playerData');
    // localStorage.removeItem('matches');
    // localStorage.removeItem('userId');
    // localStorage.removeItem('token');
    console.log('User logged out');
  }

  isActive(route: string): boolean {
    return this.router.url === route;
  }
}
