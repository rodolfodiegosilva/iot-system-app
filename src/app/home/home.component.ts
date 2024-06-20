import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule],
  template: '',
})
export class HomeComponent implements OnInit {
  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit() {
    if (this.authService.isLoggedIn()) {
      this.router.navigate(['/monitoringdashboard']);
    } else {
      this.router.navigate(['/login']);
    }
  }
}
