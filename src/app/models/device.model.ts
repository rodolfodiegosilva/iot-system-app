// src/app/models/device.model.ts
import { CommandDescription } from './command-description.model';
import { DeviceStatus } from './device-status.enum';
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
  user: User[];
  createdAt: string;
  createdBy: User;
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
