import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MonitoringService } from '../../services/monitoring.service';
import { DeviceStatus } from '../../models/device-status.enum';
import { TableModule } from 'primeng/table';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DropdownModule } from 'primeng/dropdown';
import { TagModule } from 'primeng/tag';
import { MonitoringRequest } from '../../models/monitoring-request';

@Component({
  selector: 'app-preview-monitoring',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    TableModule,
    DropdownModule,
    TagModule
  ],
  templateUrl: './preview-monitoring.component.html',
  styleUrls: ['./preview-monitoring.component.css']
})
export class PreviewMonitoringComponent implements OnInit {
  selectedDevices: MonitoringRequest[] = [];
  dropdownOptions = [
    { label: 'ON', value: DeviceStatus.ON },
    { label: 'OFF', value: DeviceStatus.OFF },
    { label: 'STANDBY', value: DeviceStatus.STANDBY }
  ];
  successMessage: string | null = null;

  constructor(
    private router: Router,
    private monitoringService: MonitoringService
  ) {
    const navigation = this.router.getCurrentNavigation();
    if (navigation?.extras.state && navigation.extras.state['selectedDevices']) {
      this.selectedDevices = navigation.extras.state['selectedDevices'].map((device: any) => ({
        deviceCode: device.deviceCode,
        status: device.status || '',
        description: ''
      }));
    }
  }

  ngOnInit() {}

  confirmMonitoring() {
    this.monitoringService.createMonitoring(this.selectedDevices).subscribe(
      () => {
        this.successMessage = 'Monitoring created successfully';
        setTimeout(() => {
          this.router.navigate(['/monitorings']);
        }, 2000); // Delay for 2 seconds before redirecting
      },
      (error) => {
        console.error('Error creating monitoring', error);
      }
    );
  }

  cancel() {
    this.router.navigate(['/monitorings']);
  }
}
