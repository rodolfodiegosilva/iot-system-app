import { Monitoring } from './monitoring.model';

export interface PaginatedData {
  content: Monitoring[];
  pageNo: number;
  pageSize: number;
  totalElements: number;
  totalPages: number;
  last: boolean;
}