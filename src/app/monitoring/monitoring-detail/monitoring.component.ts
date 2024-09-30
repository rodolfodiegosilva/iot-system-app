import { Component, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MonitoringService } from '../../services/monitoring.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { MenuItem } from 'primeng/api';

@Component({
  selector: 'app-monitoring',
  templateUrl: './monitoring.component.html',
  styleUrls: ['./monitoring.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule, BreadcrumbModule],
})
export class MonitoringComponent implements OnInit, OnChanges {
  monitoring: any;
  errorMessage: string | undefined;
  breadcrumbItems: MenuItem[];
  commandStates: { [key: string]: boolean } = {};
  commandResponse: { [key: string]: string | null } = {};
  filteredCommands: any[] = [];

  constructor(
    private route: ActivatedRoute,
    private monitoringService: MonitoringService,
    private router: Router
  ) {
    this.breadcrumbItems = [];
  }

  ngOnInit(): void {
    this.loadMonitoringData();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['monitoring']) {
      this.filterCommands();
    }
  }

  loadMonitoringData(): void {
    const monitoringCode = this.route.snapshot.paramMap.get('monitoringCode');
    if (monitoringCode) {
      this.monitoringService.getMonitoringByCode(monitoringCode).subscribe({
        next: (data: any) => {
          this.monitoring = data;
          this.errorMessage = undefined;
          this.setBreadcrumbItems();
          this.filterCommands();
        },
        error: (error) => {
          console.error('Error fetching monitoring data:', error);
          this.errorMessage = 'Monitoring not found';
          this.monitoring = undefined;
        },
      });
    }

    this.breadcrumbItems = [
      { label: 'Monitorings', routerLink: ['/monitorings'] },
      { label: 'Monitoring Detail', disabled: true },
    ];
  }

  setBreadcrumbItems(): void {
    this.breadcrumbItems = [
      { label: 'Monitorings', routerLink: ['/monitorings'] },
      {
        label: this.monitoring?.monitoringCode || 'Monitoring Detail',
        disabled: true,
      },
    ];
  }

  filterCommands(): void {
    if (
      this.monitoring &&
      this.monitoring.device &&
      this.monitoring.device.commands
    ) {
      this.filteredCommands = this.monitoring.device.commands.filter(
        (command: any) => {
          if (this.monitoring.device.deviceStatus === 'ON') {
            return command.operation !== 'Activate';
          } else if (this.monitoring.device.deviceStatus === 'OFF') {
            return command.operation !== 'Deactivate';
          } else {
            return true;
          }
        }
      );
    }
  }

  viewDevice(deviceCode: string): void {
    this.router.navigate(['/device', deviceCode]);
  }

  sendCommand(command: any): void {
    const deviceUrl = this.monitoring.device.url;
    const commandKey = command.operation;
    this.commandStates[commandKey] = true;
    this.commandResponse[commandKey] = null;

    this.monitoringService.sendDeviceCommand(deviceUrl, command).subscribe({
      next: (response) => {
        console.log('Command sent successfully:', response);
        this.commandStates[commandKey] = false;
        this.commandResponse[commandKey] = 'Command sent successfully';
        this.loadMonitoringData();
      },
      error: (error) => {
        console.error('Error sending command:', error);
        this.commandStates[commandKey] = false;
        this.commandResponse[commandKey] = 'Error sending command';
      },
    });
  }
}
