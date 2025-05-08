import { Component, OnInit } from '@angular/core';
import { NavbarComponent } from '../navbar/navbar.component';
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  imports:[NavbarComponent],
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  images: string[] = [
    'assets/image/display8.PNG',
    'assets/image/display7.PNG',
    'assets/image/display3.PNG',
    'assets/image/display6.PNG',
    'assets/image/display5.PNG'
  ];
  currentImage: string = this.images[0];
  currentIndex: number = 0;

  ngOnInit() {
    this.startImageRotation();
  }

  startImageRotation() {
    setInterval(() => {
      this.currentIndex = (this.currentIndex + 1) % this.images.length;
      this.currentImage = this.images[this.currentIndex];
    }, 3000); // Change image every 4 seconds
  }
}
