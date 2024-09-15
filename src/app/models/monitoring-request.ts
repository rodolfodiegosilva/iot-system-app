import { MonitoringStatus } from './monitoring-status.enum';

export interface MonitoringRequest {
  deviceCode: string;
  monitoringStatus: MonitoringStatus;
  description: string;
  invalidDescription?: boolean; // Propriedade opcional para validação
}
