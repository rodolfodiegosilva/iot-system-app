import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Device } from '../../models/device.model';
import { DeviceService } from '../../services/device-service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { CardModule } from 'primeng/card';
import { PanelModule } from 'primeng/panel';
import { ButtonModule } from 'primeng/button';
import { AccordionModule } from 'primeng/accordion';
import { MenuItem } from 'primeng/api';
import { DeviceMonitoringComponent } from '../device-monitoring/device-monitoring.component';

@Component({
  selector: 'app-device',
  templateUrl: './device.component.html',
  styleUrls: ['./device.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    BreadcrumbModule,
    CardModule,
    PanelModule,
    ButtonModule,
    AccordionModule,
    DeviceMonitoringComponent,
  ],
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
    this.breadcrumbItems = [];
  }

  ngOnInit(): void {
    const deviceCode = this.route.snapshot.paramMap.get('deviceCode');
    if (deviceCode) {
      this.deviceService.getDeviceByCode(deviceCode).subscribe({
        next: (data: Device) => {
          data.users = data.users.filter(
            (user) => user.email !== data.createdBy.email
          );

          this.device = data;
          this.errorMessage = undefined;
          this.setBreadcrumbItems();
        },
        error: (error) => {
          console.error('Error fetching device data:', error);
          this.errorMessage = 'Device not found';
          this.device = undefined;
        },
      });
    }

    this.breadcrumbItems = [
      { label: 'Devices', routerLink: ['/devices'] },
      { label: 'Device Detail', disabled: true },
    ];
  }

  setBreadcrumbItems(): void {
    this.breadcrumbItems = [
      { label: 'Devices', routerLink: ['/devices'] },
      { label: this.device?.deviceName || 'Device Detail', disabled: true },
    ];
  }

  navigateToPreview() {

    this.router.navigate(['/monitoring/preview'], {
      state: { selectedDevices: [this.device] },
    });
  }
}
