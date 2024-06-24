import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { DevicePaginatedData, PaginatedData } from '../models/paginated-data.model';
import { Device } from '../models/device.model';

@Injectable({
  providedIn: 'root',
})
export class DeviceService {
  private baseUrl = 'http://localhost:8080/devices';

  constructor(private http: HttpClient) {}

  getDevices(
    pageNo: number,
    pageSize: number,
    sortBy: string,
    sortDir: string,
    filters?: any
  ): Observable<DevicePaginatedData> {
    let queryParams = `?pageNo=${pageNo}&pageSize=${pageSize}&sortBy=${sortBy}&sortDir=${sortDir}`;

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

  getMonitorings(
    deviceCode: string,
    pageNo: number,
    pageSize: number,
    sortBy: string,
    sortDir: string,
    filters?: any
  ): Observable<PaginatedData> {
    let queryParams = `?pageNo=${pageNo}&pageSize=${pageSize}&sortBy=${sortBy}&sortDir=${sortDir}`;

    if (filters) {
      Object.keys(filters).forEach((key) => {
        if (filters[key]) {
          queryParams += `&${key}=${filters[key]}`;
        }
      });
    }

    return this.http.get<PaginatedData>(`${this.baseUrl}/${deviceCode}/monitorings${queryParams}`);
  }
}
