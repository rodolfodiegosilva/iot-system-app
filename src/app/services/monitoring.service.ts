import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { MonitoringPaginatedData, MonitoringRequest } from '../models/monitoring.model';

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
  ): Observable<MonitoringPaginatedData> {
    let queryParams = `/pageable?pageNo=${pageNo}&pageSize=${pageSize}&sortBy=${sortBy}&sortDir=${sortDir}`;

    if (filters) {
      Object.keys(filters).forEach((key) => {
        if (filters[key]) {
          queryParams += `&${key}=${filters[key]}`;
        }
      });
    }

    return this.http.get<MonitoringPaginatedData>(`${this.baseUrl}${queryParams}`);
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
  updateMonitoring(monitoringCode: string, updateData: any): Observable<any> {
    return this.http.put(`${this.baseUrl}/${monitoringCode}`, updateData);
  }
  deleteMonitoring(monitoringCode: string): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${monitoringCode}`);
  }
  
  
}
