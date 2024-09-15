import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private baseUrl = `${environment.apiUrl}/users`;

  constructor(private http: HttpClient) {}

  searchUsers(searchTerm: string): Observable<any[]> {
    const queryParams = `?searchTerm=${searchTerm}`;
    return this.http.get<any[]>(`${this.baseUrl}/search${queryParams}`);
  }
}
