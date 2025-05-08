import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FooterComponent } from '../footer/footer.component';
import { NavbarComponent } from '../navbar/navbar.component';
import { Router } from '@angular/router';
@Component({
  selector: 'app-cricplay',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './cricplay.component.html',
  styleUrls: ['./cricplay.component.css'],
})
export class CricplayComponent {

  constructor(private router: Router) {}
  
goToLogin() {
  this.router.navigate(['/login']);
}
goToAdmin(){
  this.router.navigate(['/adminlogin']);
}
}
