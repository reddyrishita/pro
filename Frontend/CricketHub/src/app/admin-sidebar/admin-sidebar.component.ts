import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-admin-sidebar',
  standalone: true,
  imports: [CommonModule],
  template: `
    <aside class="sidebar">
      <ul>
        <li (click)="setActive('users')">Users</li>
        <li (click)="setActive('trainers')">Trainers</li>
        <li (click)="setActive('addTrainer')">Add Trainer</li>
      </ul>
    </aside>
  `,
  styles: [`
    .sidebar { width: 250px; background: #333; color: white; position: fixed; left: 0; top: 50px; height: 100vh; transform: translateX(-100%); transition: 0.3s; }
    .sidebar.open { transform: translateX(0); }
    ul { list-style: none; padding: 10px; }
    li { padding: 10px; cursor: pointer; }
    li:hover { background: #444; }
  `]
})
export class AdminSidebarComponent {
  setActive(section: string) {
    document.querySelectorAll('section').forEach(sec => sec.classList.add('hidden'));
    document.getElementById(section)?.classList.remove('hidden');
  }
}
