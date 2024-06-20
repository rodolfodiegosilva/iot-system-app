import { Device } from './device.model';
import { Monitoring } from './monitoring.model';

export interface PaginatedData {
  content: Monitoring[];
  pageNo: number;
  pageSize: number;
  totalElements: number;
  totalPages: number;
  last: boolean;
}

export interface DevicePaginatedData {
  content: Device[];
  pageNo: number;
  pageSize: number;
  totalElements: number;
  totalPages: number;
  last: boolean;
}
