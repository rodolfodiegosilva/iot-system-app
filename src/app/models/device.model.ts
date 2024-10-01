// src/app/models/device.model.ts
import { CommandDescription } from './command-description.model';
import { DeviceStatus } from './device-status.enum';
import { Monitoring } from './monitoring.model';
import { User } from './user.model';
export interface Device {
  id: number;
  deviceCode: string;
  deviceName: string;
  description: string;
  industryType: string;
  manufacturer: string;
  url: string;
  deviceStatus: string;
  commands: CommandDescription[];
  users: User[];
  createdAt: string;
  createdBy: User;
  monitoring?: Monitoring;
  isUserAssociated?: boolean;
  canEdit?: boolean;
}

export interface DeviceRequest {
  deviceCode?: string;
  deviceName: string;
  description: string;
  industryType: string;
  manufacturer: string;
  url: string;
  deviceStatus: DeviceStatus;
  usernames: string[];
  commands: CommandDescription[];
}
