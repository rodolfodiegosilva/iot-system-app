import { Device } from './device.model';
import { User } from './user.model';

export interface Monitoring {
  id: number;
  monitoringCode: string;
  createdBy: User;
  users: User[];
  device: Device;
  monitoringStatus: MonitoringStatus;
  createdAt: string;
  updatedAt: string;
}

export enum MonitoringStatus {
  ON = 'ON',
  OFF = 'OFF',
  STANDBY = 'STANDBY',
}

export interface MonitoringRequest {
  deviceCode: string;
  monitoringStatus: MonitoringStatus;
  description: string;
  invalidDescription?: boolean;
}

export interface MonitoringPaginatedData {
  content: Monitoring[];
  pageNo: number;
  pageSize: number;
  totalElements: number;
  totalPages: number;
  last: boolean;
}

