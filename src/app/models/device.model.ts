// src/app/models/device.model.ts
import { User } from './user.model';

export interface Device {
  id: number;
  name: string;
  description: string;
  status: string;
  deviceCode: string;
  user: User;
  createdAt: string;
}
