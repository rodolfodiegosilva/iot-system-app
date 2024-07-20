import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MonitoringService } from '../../services/monitoring.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { DropdownModule } from 'primeng/dropdown';
import { TagModule } from 'primeng/tag';
import { MonitoringRequest } from '../../models/monitoring-request';
import { MonitoringStatus } from '../../models/monitoring-status.enum';

@Component({
  selector: 'app-preview-monitoring',
  standalone: true,
  imports: [CommonModule, FormsModule, TableModule, DropdownModule, TagModule],
  templateUrl: './preview-monitoring.component.html',
  styleUrls: ['./preview-monitoring.component.css'],
})
export class PreviewMonitoringComponent implements OnInit {
  selectedDevices: MonitoringRequest[] = [];
  dropdownOptions = [
    { label: 'ON', value: MonitoringStatus.ON },
    { label: 'OFF', value: MonitoringStatus.OFF },
    { label: 'STANDBY', value: MonitoringStatus.STANDBY },
  ];
  successMessage: string | null = null;
  errorMessage: string | null = null;

  constructor(
    private router: Router,
    private monitoringService: MonitoringService
  ) {
    const navigation = this.router.getCurrentNavigation();
    if (
      navigation?.extras.state &&
      navigation.extras.state['selectedDevices']
    ) {
      this.selectedDevices = navigation.extras.state['selectedDevices'].map(
        (device: any) => ({
          deviceCode: device.deviceCode,
          monitoringStatus: MonitoringStatus.STANDBY,
          description: '',
        })
      );
    }
  }

  ngOnInit(): void {}

  confirmMonitoring(): void {
    this.monitoringService
      .createMonitoring(this.selectedDevices as MonitoringRequest[])
      .subscribe({
        next: () => {
          this.successMessage = 'Monitoring created successfully';
          this.errorMessage = null;
          setTimeout(() => {
            this.router.navigate(['/monitorings']);
          }, 2000);
        },
        error: (error) => {
          console.error('Error creating monitoring', error);
          this.errorMessage = 'Error creating monitoring. Please try again.';
        },
      });
  }

  cancel(): void {
    this.router.navigate(['/monitorings']);
  }
}
