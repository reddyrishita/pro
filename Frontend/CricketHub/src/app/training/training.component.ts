import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms'; // Import FormsModule
import { NavbarComponent } from '../navbar/navbar.component';
@Component({
  selector: 'app-training',
  standalone: true,
  templateUrl: './training.component.html',
  styleUrls: ['./training.component.css'],
  imports: [FormsModule, CommonModule,NavbarComponent], // Add FormsModule here
})
export class TrainingComponent {
  coachType = ''; // Dropdown selection
  searchQuery = ''; // Search bar input
  images = [
    'assets/image/live.jpg',
    'assets/image/login.jpg',
    'assets/image/ground.jpg',
    'assets/image/logo.png',
  ]; // List of images
  usedImages: string[] = []; // Track used images

  trainingCards = [
    {
      id: 1,
      name: 'Ganesh',
      email: 'coach@gmail.com',
      contact: '63723878',
      specialization: 'Batting Coach',
      achievements: 'EX Ranji Player',
      location: 'Shapur',
      image: this.assignUniqueImage(),
    },
    {
      id: 2,
      name: 'Rahul',
      email: 'rahul@gmail.com',
      contact: '98765432',
      specialization: 'Bowling Coach',
      achievements: 'EX IPL Player',
      location: 'Hyderabad',
      image: this.assignUniqueImage(),
    },
    {
      id: 3,
      name: 'Suresh',
      email: 'suresh@gmail.com',
      contact: '78906543',
      specialization: 'Bowling Coach',
      achievements: 'EX National Player',
      location: 'Bangalore',
      image: this.assignUniqueImage(),
    },
    {
      id: 4,
      name: 'Vikas',
      email: 'vikas@gmail.com',
      contact: '81234567',
      specialization: 'Batting Coach',
      achievements: 'EX International Player',
      location: 'Chennai',
      image: this.assignUniqueImage(),
    },
  ];

  // Function to assign unique images to cards
  assignUniqueImage(): string {
    const availableImages = this.images.filter((img) => !this.usedImages.includes(img));
    const randomImage = availableImages[Math.floor(Math.random() * availableImages.length)];
    this.usedImages.push(randomImage);
    return randomImage;
  }

  // Filter cards based on location and coach type
  getFilteredCards() {
    return this.trainingCards.filter(
      (card) =>
        card.location.toLowerCase().includes(this.searchQuery.toLowerCase()) &&
        (this.coachType === '' || card.specialization === this.coachType)
    );
  }
}
