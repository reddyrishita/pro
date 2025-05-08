import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule],
  template: `
    <footer>
      <p>Unleashing the Spirit of Cricket!</p>
      <p>
        Contact Us: 9392995540, supportgullycricket.com,
        123 Cricket Lane, Sports City
      </p>
    </footer>
  `,
  styles: [
    `
      footer {
        background-color: #fff;
        border-top: 2px solid rgb(245, 244, 247);
        padding: 1rem;
        text-align: center;
        font-size: 0.9rem;
        margin-top: 2rem;
      }
      footer p {
        margin: 0.5rem 0;
        color: #000;
      }
    `,
  ],
})
export class FooterComponent {}
