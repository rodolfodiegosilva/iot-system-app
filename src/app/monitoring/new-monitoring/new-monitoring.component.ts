import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, takeUntil } from 'rxjs/operators';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { InputTextModule } from 'primeng/inputtext';
import { MultiSelectModule } from 'primeng/multiselect';
import { DropdownModule } from 'primeng/dropdown';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Device, DevicePaginatedData } from '../../models/device.model';
import { DeviceService } from '../../services/device-service';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { User } from '../../models/user.model';

@Component({
  selector: 'app-new-monitoring',
  standalone: true,
  imports: [
    TableModule,
    TagModule,
    InputTextModule,
    MultiSelectModule,
    DropdownModule,
    CommonModule,
    FormsModule,
  ],
  templateUrl: './new-monitoring.component.html',
  styleUrls: ['./new-monitoring.component.css'],
})
export class NewMonitoringComponent implements OnInit, OnDestroy {
  devices: Device[] = [];
  selectedDevices: Device[] = [];
  loading: boolean = true;
  totalRecords: number = 0;
  filters: any = {};
  statuses: any[] = [];
  selectedStatus: string = '';
  loggedUser: User | null = null;
  private searchSubject = new Subject<any>();
  private destroy$ = new Subject<void>();

  constructor(
    private deviceService: DeviceService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    this.statuses = [
      { label: 'OFF', value: 'OFF' },
      { label: 'ON', value: 'ON' },
      { label: 'STANDBY', value: 'STANDBY' },
    ];

    this.authService.fetchUserData().subscribe({
      next: (data: User) => {
        this.loggedUser = data;
        this.loadDevices({ first: 0, rows: 10 });
      },
      error: () => {
        console.error('User not found');
      },
    });

    this.searchSubject
      .pipe(debounceTime(300), distinctUntilChanged(), takeUntil(this.destroy$))
      .subscribe((filters) => {
        this.filters = filters;
        this.loadDevices({ first: 0, rows: 10 });
      });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadDevices(event: any) {
    this.loading = true;
    const page = event.first / event.rows;
    const size = event.rows;
    const sortBy = event.sortField || 'deviceCode';
    const sortDir = event.sortOrder === 1 ? 'asc' : 'desc';

    this.deviceService
      .getDevices(page, size, sortBy, sortDir, this.filters)
      .subscribe((data: DevicePaginatedData) => {
        this.devices = data.content;
        this.totalRecords = data.totalElements;
        this.loading = false;

        if (this.loggedUser) {
          const isAdmin = this.loggedUser.role === 'ADMIN';
          this.devices.forEach((device) => {
            if (isAdmin) {
              device.canEdit = true;
            } else {
              device.isUserAssociated = this.isUserAssociatedWithDevice(
                device,
                this.loggedUser!
              );
              device.canEdit = device.isUserAssociated;
            }
          });
        }
      });
  }

  isUserAssociatedWithDevice(device: Device, user: User): boolean {
    return (
      device.users.some((dUser) => dUser.id === user.id) ||
      device.createdBy.id === user.id
    );
  }

  clearFilters() {
    this.filters = {};
    this.loadDevices({ first: 0, rows: 10 });
  }

  onFilter(event: any, field: string) {
    const updatedFilters = {
      ...this.filters,
      [field]: event.target.value || '',
    };
    this.searchSubject.next(updatedFilters);
  }

  onFilterDropdown(event: any, field: string) {
    const updatedFilters = { ...this.filters, [field]: event.value || '' };
    this.searchSubject.next(updatedFilters);
  }

  navigateToPreview() {
    this.router.navigate(['/monitoring/preview'], {
      state: { selectedDevices: this.selectedDevices },
    });
  }

  getSeverity(
    status: string
  ):
    | 'success'
    | 'info'
    | 'warning'
    | 'danger'
    | 'secondary'
    | 'contrast'
    | undefined {
    switch (status) {
      case 'OFF':
        return 'danger';
      case 'ON':
        return 'success';
      case 'STANDBY':
        return 'warning';
      default:
        return 'secondary';
    }
  }
}
