import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Device } from '../../models/device.model';
import { DeviceService } from '../../services/device-service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { MenuItem } from 'primeng/api';

@Component({
  selector: 'app-device',
  templateUrl: './device.component.html',
  styleUrls: ['./device.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    BreadcrumbModule
  ]
})
export class DeviceComponent implements OnInit {
  device: Device | undefined;
  errorMessage: string | undefined;
  breadcrumbItems: MenuItem[];

  constructor(
    private route: ActivatedRoute,
    private deviceService: DeviceService,
    private router: Router
  ) {
    this.breadcrumbItems = []; // Inicialização
  }

  ngOnInit(): void {
    const deviceCode = this.route.snapshot.paramMap.get('deviceCode');
    if (deviceCode) {
      this.deviceService.getDeviceByCode(deviceCode).subscribe({
        next: (data: Device) => {
          console.log('Device data received:', data); // Debug log
          this.device = data;
          this.errorMessage = undefined;
          this.setBreadcrumbItems(); // Set breadcrumbs after data is loaded
        },
        error: (error) => {
          console.error('Error fetching device data:', error); // Error log
          this.errorMessage = 'Device not found'; // Set error message
          this.device = undefined; // Clear any previous device data
        },
      });
    }

    this.breadcrumbItems = [
      { label: 'Devices', routerLink: ['/devices'] },
      { label: 'Device Detail', disabled: true }
    ];
  }

  setBreadcrumbItems(): void {
    this.breadcrumbItems = [
      { label: 'Devices', routerLink: ['/devices'] },
      { label: this.device?.name || 'Device Detail', disabled: true }
    ];
  }
}
