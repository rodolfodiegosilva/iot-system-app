import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { DevicePaginatedData, PaginatedData } from '../models/paginated-data.model';
import { Device } from '../models/device.model';

@Injectable({
  providedIn: 'root',
})
export class DeviceService {
  private baseUrl = 'http://ec2-3-17-185-96.us-east-2.compute.amazonaws.com:8080/devices';

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

  createDevice(device: Device): Observable<Device> {
    return this.http.post<Device>(`${this.baseUrl}`, device);
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
      'Mining'
    ];
    return of(mockIndustryTypes);
  }

  getAllDevices(): Observable<Device[]> {
    return this.http.get<Device[]>(`${this.baseUrl}`);
  }
}
