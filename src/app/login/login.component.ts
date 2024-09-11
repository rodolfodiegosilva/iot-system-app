import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  username: string = '';
  password: string = '';
  errorMessage: string = '';

  constructor(private authService: AuthService, private router: Router) {}

  login() {
    this.errorMessage = '';
    localStorage.removeItem('access_token');
    this.authService.login(this.username, this.password).subscribe(
      (response) => {
        localStorage.setItem('access_token', response.token);
        this.authService.fetchUserData().subscribe((userData) => {
          this.authService.setUserData(userData);
          this.authService.navigateToDashboard();
        });
      },
      (error) => {
        if (error.status === 400 && error.error.message) {
          this.errorMessage = error.error.message;
        } else {
          this.errorMessage = 'An unexpected error occurred.';
        }
      }
    );
  }
  navigateToRegister() {
    this.router.navigate(['/register']);
  }
}
