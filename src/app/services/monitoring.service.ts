import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PaginatedData } from '../models/paginated-data.model';

@Injectable({
  providedIn: 'root'
})
export class MonitoringService {
  private apiUrl = 'http://localhost:8080';

  constructor(private http: HttpClient) {}

  getMonitoringData(pageNo: number, pageSize: number, sortBy: string, sortDir: string): Observable<PaginatedData> {
    let params = new HttpParams()
      .set('pageNo', pageNo.toString())
      .set('pageSize', pageSize.toString())
      .set('sortBy', sortBy)
      .set('sortDir', sortDir);

    return this.http.get<any>(`${this.apiUrl}/monitoring`, { params });
  }
}