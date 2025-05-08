import { FooterComponent } from './footer/footer.component';
import { RouterOutlet } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';


@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  imports: [RouterOutlet, FooterComponent],
})
export class AppComponent implements OnInit {
  title(title: any) {
    throw new Error('Method not implemented.');
  }
  hideNavbar = false;
  hideFooter = false;

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        const hiddenRoutes = ['/login', '/register', '/cricplay'];
        // Update hide flags based on current route
        this.hideNavbar = hiddenRoutes.some((route) => event.url.startsWith(route));
        this.hideFooter = hiddenRoutes.some((route) => event.url.startsWith(route));
      }
    });
  }
}
