import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { Device, DevicePaginatedData, DeviceRequest } from '../models/device.model';
import { environment } from '../../environments/environment';
import { Monitoring, MonitoringPaginatedData } from '../models/monitoring.model';

@Injectable({
  providedIn: 'root',
})
export class DeviceService {
  private baseUrl = `${environment.apiUrl}/devices`;

  constructor(private http: HttpClient) {}

  getDevices(
    pageNo: number,
    pageSize: number,
    sortBy: string,
    sortDir: string,
    filters?: any
  ): Observable<DevicePaginatedData> {
    let queryParams = `/pageable?pageNo=${pageNo}&pageSize=${pageSize}&sortBy=${sortBy}&sortDir=${sortDir}`;

    if (filters) {
      Object.keys(filters).forEach((key) => {
        if (filters[key]) {
          queryParams += `&${key}=${filters[key]}`;
        }
      });
    }

    return this.http.get<DevicePaginatedData>(`${this.baseUrl}${queryParams}`);
  }

  getDeviceByCode(deviceCode: string): Observable<Device> {
    return this.http.get<Device>(`${this.baseUrl}/${deviceCode}`);
  }

  createDevice(device: DeviceRequest): Observable<Device> {
    return this.http.post<Device>(`${this.baseUrl}`, device);
  }

  getMonitorings(
    deviceCode: string,
    pageNo: number,
    pageSize: number,
    sortBy: string,
    sortDir: string,
    filters?: any
  ): Observable<MonitoringPaginatedData> {
    let queryParams = `?pageNo=${pageNo}&pageSize=${pageSize}&sortBy=${sortBy}&sortDir=${sortDir}`;

    if (filters) {
      Object.keys(filters).forEach((key) => {
        if (filters[key]) {
          queryParams += `&${key}=${filters[key]}`;
        }
      });
    }

    return this.http.get<MonitoringPaginatedData>(
      `${this.baseUrl}/${deviceCode}/monitorings${queryParams}`
    );
  }

  getIndustryTypes(): Observable<string[]> {
    const mockIndustryTypes = [
      'Agriculture',
      'Automotive',
      'Construction',
      'Education',
      'Energy',
      'Finance',
      'Healthcare',
      'Hospitality',
      'Manufacturing',
      'Retail',
      'Technology',
      'Telecommunications',
      'Transportation',
      'Utilities',
      'Food & Beverage',
      'Pharmaceuticals',
      'Real Estate',
      'Media',
      'Aerospace',
      'Mining',
    ];
    return of(mockIndustryTypes);
  }

  getAllDevices(): Observable<Device[]> {
    return this.http.get<Device[]>(`${this.baseUrl}`);
  }

  updateDevice(deviceCode: string, device: DeviceRequest): Observable<Device> {
    return this.http.put<Device>(`${this.baseUrl}/${deviceCode}`, device);
  }

  getMonitoringByDeviceCode(deviceCode: string): Observable<Monitoring> {
    return this.http.get<Monitoring>(`${this.baseUrl}/${deviceCode}/monitoring`);
  }
  
  deleteDevice(deviceCode: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${deviceCode}`);
  }
  
  
}
