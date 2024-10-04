import { Component, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MonitoringService } from '../../services/monitoring.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { MenuItem } from 'primeng/api';
import { AuthService } from '../../services/auth.service';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { Monitoring } from '../../models/monitoring.model';

@Component({
  selector: 'app-monitoring',
  templateUrl: './monitoring.component.html',
  styleUrls: ['./monitoring.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    BreadcrumbModule,
    DialogModule,
    ButtonModule,
  ],
})
export class MonitoringComponent implements OnInit, OnChanges {
  monitoring: any;
  errorMessage: string | undefined;
  breadcrumbItems: MenuItem[];
  commandStates: { [key: string]: boolean } = {};
  commandResponse: { [key: string]: string | null } = {};
  filteredCommands: any[] = [];
  loggedUser: any;

  displayEditModal: boolean = false;
  displayDeleteModal: boolean = false;
  editMonitoringData: any = {
    monitoringStatus: '',
    deviceCode: '',
    description: '',
  };

  constructor(
    private route: ActivatedRoute,
    private monitoringService: MonitoringService,
    private authService: AuthService,
    private router: Router
  ) {
    this.breadcrumbItems = [];
  }

  ngOnInit(): void {
    this.fetchLoggedUser();
    this.loadMonitoringData();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['monitoring']) {
      this.filterCommands();
    }
  }

  fetchLoggedUser(): void {
    this.authService.fetchUserData().subscribe({
      next: (data: any) => {
        this.loggedUser = data;
      },
      error: () => {
        this.errorMessage = 'User not found';
      },
    });
  }

  loadMonitoringData(): void {
    const monitoringCode = this.route.snapshot.paramMap.get('monitoringCode');
    if (monitoringCode) {
      this.monitoringService.getMonitoringByCode(monitoringCode).subscribe({
        next: (data: Monitoring) => {
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

  canEditOrDelete(): boolean {
    return (
      this.loggedUser &&
      (this.loggedUser.id === this.monitoring?.createdBy?.id ||
        this.loggedUser.role === 'ADMIN')
    );
  }

  openEditModal(): void {
    this.editMonitoringData = {
      monitoringStatus: this.monitoring.monitoringStatus,
      deviceCode: this.monitoring.device.deviceCode,
      description: this.monitoring.description,
    };
    this.displayEditModal = true;
  }

  cancelEdit(): void {
    this.displayEditModal = false;
  }

  saveEdit(): void {
    const monitoringCode = this.monitoring.monitoringCode;
    this.monitoringService
      .updateMonitoring(monitoringCode, this.editMonitoringData)
      .subscribe({
        next: () => {
          this.displayEditModal = false;
          this.loadMonitoringData();
        },
        error: (error) => {
          this.errorMessage = 'Error updating monitoring';
        },
      });
  }

  openDeleteModal(): void {
    this.displayDeleteModal = true;
  }

  cancelDelete(): void {
    this.displayDeleteModal = false;
  }

  confirmDeleteMonitoring(): void {
    const monitoringCode = this.monitoring.monitoringCode;
    this.monitoringService.deleteMonitoring(monitoringCode).subscribe({
      next: () => {
        this.router.navigate(['/monitorings']);
      },
      error: (error) => {
        this.errorMessage = 'Error deleting monitoring';
      },
    });
  }
}
