import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NavbarComponent } from '../navbar/navbar.component';
import { CreatetournamentService } from '../services/createtournament.service';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-create-tournament',
  standalone: true,
  templateUrl: './create-tournament.component.html',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    NavbarComponent,
    HttpClientModule
  ],
  styleUrls: ['./create-tournament.component.css']
})
export class CreateTournamentComponent {
  tournamentForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private tournamentService: CreatetournamentService
  ) {
    this.tournamentForm = this.fb.group({
      location: ['', Validators.required],
      teamSize: ['', [Validators.required, Validators.min(1)]],
      date: ['', Validators.required],
      sponsors: ['', [Validators.required, Validators.min(1)]],
      supportStaff: ['', [Validators.required, Validators.min(1)]]
    });
  }

  onSubmit() {
    if (this.tournamentForm.valid) {
      this.tournamentService.createTournament(this.tournamentForm.value)
        .subscribe({
          next: (response) => {
            console.log('Tournament created successfully', response);
            this.router.navigate(['/organizer-dashboard']);
          },
          error: (error) => {
            console.error('Error creating tournament', error);
            alert('Error creating tournament. Please try again.');
          }
        });
    } else {
      alert('Please fill out all fields correctly!');
    }
  }

}
