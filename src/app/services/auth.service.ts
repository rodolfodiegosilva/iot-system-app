import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:8080';
  private userData: any;

  constructor(private http: HttpClient, private router: Router) {}

  login(username: string, password: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/auth/login`, { username, password });
  }

  logout() {
    const token = localStorage.getItem('access_token');
    const headers = new HttpHeaders({ 'Authorization': `Bearer ${token}` });
    this.http.post(`${this.apiUrl}/auth/logout`, {}, { headers }).subscribe(() => {
      localStorage.removeItem('access_token');
      this.router.navigate(['/login']);
    });
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('access_token');
  }

  navigateToDashboard() {
    this.router.navigate(['/monitorings']);
  }

  fetchUserData(): Observable<any> {
    const token = localStorage.getItem('access_token');
    const headers = new HttpHeaders({ 'Authorization': `Bearer ${token}` });
    return this.http.get<any>(`${this.apiUrl}/auth/user`, { headers });
  }

  setUserData(data: any) {
    this.userData = data;
  }

  getUserData() {
    return this.userData;
  }
}
