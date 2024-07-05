// models/monitoring-request.model.ts

import { DeviceStatus } from './device-status.enum';

export interface MonitoringRequest {
  deviceCode: string;
  status: DeviceStatus;
  description: string;
}
