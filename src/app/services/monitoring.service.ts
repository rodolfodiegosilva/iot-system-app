import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PaginatedData } from '../models/paginated-data.model';
import { MonitoringRequest } from '../models/monitoring-request';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class MonitoringService {
  private baseUrl = `${environment.apiUrl}/monitoring`;

  constructor(private http: HttpClient) {}

  getMonitoringData(
    pageNo: number,
    pageSize: number,
    sortBy: string,
    sortDir: string,
    filters?: any
  ): Observable<PaginatedData> {
    let queryParams = `/pageable?pageNo=${pageNo}&pageSize=${pageSize}&sortBy=${sortBy}&sortDir=${sortDir}`;

    if (filters) {
      Object.keys(filters).forEach((key) => {
        if (filters[key]) {
          queryParams += `&${key}=${filters[key]}`;
        }
      });
    }

    return this.http.get<PaginatedData>(`${this.baseUrl}${queryParams}`);
  }

  getMonitoringByCode(monitoringCode: string): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/${monitoringCode}`);
  }

  createMonitoring(request: MonitoringRequest[]): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}`, request);
  }

  sendDeviceCommand(deviceUrl: string, command: any): Observable<any> {
    console.log(command);
    
    return this.http.post<any>(`${deviceUrl}`, command);
  }
}
