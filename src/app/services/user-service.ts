import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { SimpleUser, User } from '../models/user.model';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private baseUrl = `${environment.apiUrl}/users`;

  constructor(private http: HttpClient) {}

  searchUsers(searchTerm: string): Observable<SimpleUser[]> {
    const queryParams = `?searchTerm=${searchTerm}`;
    return this.http.get<SimpleUser[]>(`${this.baseUrl}/search${queryParams}`);
  }
}
