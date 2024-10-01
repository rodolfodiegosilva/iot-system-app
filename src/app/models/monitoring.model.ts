// src/app/models/monitoring.model.ts
import { Device } from './device.model';
import { User } from './user.model';

export interface Monitoring {
  id: number;
  monitoringCode: string;
  user: User;
  device: Device;
  monitoringStatus: string;
  createdAt: string;
  updatedAt: string;
}
