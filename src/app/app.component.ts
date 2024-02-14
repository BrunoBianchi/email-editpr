import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { AutoFocusModule } from 'primeng/autofocus';
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet,AutoFocusModule ],
  template:`<router-outlet></router-outlet>`
})
export class AppComponent {
  title = 'email-website';
}
