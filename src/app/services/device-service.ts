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
    sortDir: string,
    filters?:any
  ): Observable<DevicePaginatedData> {
    let queryParams = `?pageNo=${pageNo}&pageSize=${pageSize}&sortBy=${sortBy}&sortDir=${sortDir}`;
   

    if (filters) {
      Object.keys(filters).forEach(key => {
        if (filters[key]) {
          queryParams += `&${key}=${filters[key]}`;
        }
      });
    }

    return this.http.get<DevicePaginatedData>(`${this.baseUrl}${queryParams}`);
  }
}
