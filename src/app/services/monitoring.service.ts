import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PaginatedData } from '../models/paginated-data.model';

@Injectable({
  providedIn: 'root',
})
export class MonitoringService {
  private baseUrl = 'http://localhost:8080/monitoring';

  constructor(private http: HttpClient) {}

  getMonitoringData(
    pageNo: number,
    pageSize: number,
    sortBy: string,
    sortDir: string,
    filters?: any
  ): Observable<PaginatedData> {
    let queryParams = `?pageNo=${pageNo}&pageSize=${pageSize}&sortBy=${sortBy}&sortDir=${sortDir}`;

    if (filters) {
      Object.keys(filters).forEach(key => {
        if (filters[key]) {
          queryParams += `&${key}=${filters[key]}`;
        }
      });
    }

    return this.http.get<PaginatedData>(`${this.baseUrl}${queryParams}`);
  }
}
