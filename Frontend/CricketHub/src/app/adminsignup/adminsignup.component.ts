import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { trigger, style, animate, transition } from '@angular/animations';
import { AdminsignupService } from '../services/adminsignup.service';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-adminsignup',
  standalone: true,
  imports: [
    CommonModule, 
    ReactiveFormsModule,
    HttpClientModule,
  ],
  templateUrl: './adminsignup.component.html',
  styleUrls: ['./adminsignup.component.css'],
  animations: [
    trigger('fadeInOut', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(-20px)' }),
        animate('500ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
      ])
    ])
  ]
})
export class AdminsignupComponent {
  registerForm: FormGroup;
  isDarkMode = false; // Dark mode toggle

  constructor(
    private router: Router,
    private toastr: ToastrService,
    private fb: FormBuilder,
    private adminsignupService: AdminsignupService
  ) {
    this.registerForm = this.fb.group({
      // fullName: ['', [Validators.required]],
      username: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  // Handle form submission
  onSubmit() {
    if (this.registerForm.valid) {
      console.log('Form is valid, submitting data...'); // Debug log
      const userData = {
        userName: this.registerForm.get('username')?.value,
        userEmail: this.registerForm.get('email')?.value,
        password: this.registerForm.get('password')?.value,
        // fullName: this.registerForm.get('fullName')?.value,
      };

      console.log('User data:', userData); // Debug log

      this.adminsignupService.registerAdmin(userData).subscribe({
        next: (response) => {
          console.log('Registration successful:', response); // Debug log
          this.toastr.success('Registration successful!', 'Welcome to CricketHub');
          this.router.navigate(['/adminlogin']);
        },
        error: (error) => {
          console.error('Registration error:', error); // Debug log
          let errorMessage = 'Registration failed. Please try again.';
          if (error.error?.message) {
            errorMessage = error.error.message;
          }
          this.toastr.error(errorMessage, 'Error');
        }
      });
    } else {
      console.log('Form is invalid:', this.registerForm.errors); // Debug log
      this.toastr.error('Please fill in all required fields correctly.', 'Form Error');
      // Mark all fields as touched to trigger validation messages
      Object.keys(this.registerForm.controls).forEach(key => {
        const control = this.registerForm.get(key);
        control?.markAsTouched();
      });
    }
  }

  // Redirect to login page
  goToLogin() {
    this.router.navigate(['/adminlogin']);
  }

  // Toggle dark mode
  toggleDarkMode() {
    this.isDarkMode = !this.isDarkMode;
    const registerPage = document.querySelector('.register-page');
    if (registerPage) {
      if (this.isDarkMode) {
        registerPage.classList.add('dark-mode');
      } else {
        registerPage.classList.remove('dark-mode');
      }
    }
  }
}