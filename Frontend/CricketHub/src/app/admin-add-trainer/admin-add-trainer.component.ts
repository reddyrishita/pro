import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-admin-add-trainer',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section id="addTrainer">
      <form>
        <label>Name: <input type="text"></label>
        <label>Experience: <input type="number"></label>
        <label>Email: <input type="email"></label>
        <label>City: <input type="text"></label>
        <label>Specialization:
          <select>
            <option>Batting</option>
            <option>Bowling</option>
          </select>
        </label>
        <button type="submit">Add Trainer</button>
      </form>
    </section>
  `,
  styles: [`form { display: flex; flex-direction: column; max-width: 300px; } label { margin-bottom: 10px; }`]
})
export class AdminAddTrainerComponent {}
