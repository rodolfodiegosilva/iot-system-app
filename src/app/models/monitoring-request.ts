// models/monitoring-request.model.ts

import { MonitoringStatus } from "./monitoring-status.enum";


export interface MonitoringRequest {
  deviceCode: string;
  monitoringStatus: MonitoringStatus;
  description: string;
}
