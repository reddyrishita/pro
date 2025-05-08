import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-admin-trainers',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section id="trainers">
      <table>
        <tr><th>Name</th><th>ID</th><th>Experience</th><th>Email</th><th>City</th><th>Specialization</th></tr>
        <tr *ngFor="let trainer of trainers">
          <td>{{ trainer.name }}</td><td>{{ trainer.id }}</td><td>{{ trainer.experience }}</td>
          <td>{{ trainer.email }}</td><td>{{ trainer.city }}</td><td>{{ trainer.specialization }}</td>
        </tr>
      </table>
    </section>
  `
})
export class AdminTrainersComponent {
  trainers = [{ name: 'Rahul Dravid', id: 'RD01', experience: 10, email: 'rd@bcci.com', city: 'Bangalore', specialization: 'Batting' }];
}
