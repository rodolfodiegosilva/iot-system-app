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

interface MonitoringRequestExtended extends MonitoringRequest {
  invalidDescription?: boolean;
}

@Component({
  selector: 'app-preview-monitoring',
  standalone: true,
  imports: [CommonModule, FormsModule, TableModule, DropdownModule, TagModule],
  templateUrl: './preview-monitoring.component.html',
  styleUrls: ['./preview-monitoring.component.css'],
})
export class PreviewMonitoringComponent implements OnInit {
  selectedDevices: MonitoringRequestExtended[] = [];
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
        (device: MonitoringRequest) => ({
          deviceCode: device.deviceCode,
          monitoringStatus: MonitoringStatus.ON,
          description: '',
          invalidDescription: false,
        })
      );
    }
  }

  ngOnInit(): void {}

  confirmMonitoring(): void {
    let isValid = true;

    this.selectedDevices.forEach((device) => {
      if (!device.description || device.description.trim() === '') {
        device.invalidDescription = true;
        isValid = false;
      } else {
        device.invalidDescription = false;
      }
    });

    if (!isValid) {
      this.errorMessage = 'Please fill out all description fields.';
      return;
    }

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
