import { Component, OnInit, HostListener } from '@angular/core';
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
  isMobile: boolean = false;

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit() {
    this.checkScreenSize();
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

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.checkScreenSize();
  }

  checkScreenSize() {
    this.isMobile = window.innerWidth <= 768;
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
