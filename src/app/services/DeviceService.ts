import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { DevicePaginatedData } from '../models/paginated-data.model';

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
    sortDir: string
  ): Observable<DevicePaginatedData> {
    return this.http.get<DevicePaginatedData>(
      `${this.baseUrl}?pageNo=${pageNo}&pageSize=${pageSize}&sortBy=${sortBy}&sortDir=${sortDir}`
    );
  }
}
