import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
})
export class NavBarComponent implements OnInit {
  userName: string = '';
  isLoading: boolean = false;
  errorMessage: string = '';

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit() {
    if (this.authService.isLoggedIn()) {
      this.isLoading = true;
      const userData = this.authService.getUserData();
      if (userData) {
        this.userName = userData.name;
        this.isLoading = false;
      } else {
        this.authService.fetchUserData().subscribe({
          next: (data) => {
            this.userName = data.name;
            this.authService.setUserData(data);
            this.isLoading = false;
          },
          error: (error) => {
            this.errorMessage = 'Falha ao carregar dados do usuário';
            this.isLoading = false;
          },
        });
      }
    }
  }

  isLoggedIn(): boolean {
    return this.authService.isLoggedIn();
  }

  isLoginPage(): boolean {
    return this.router.url === '/login';
  }

  isRegisterPage(): boolean {
    return this.router.url === '/register';
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
