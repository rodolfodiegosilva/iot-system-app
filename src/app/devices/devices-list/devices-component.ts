import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, takeUntil } from 'rxjs/operators';
import { Table, TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { HttpClientModule } from '@angular/common/http';
import { InputTextModule } from 'primeng/inputtext';
import { MultiSelectModule } from 'primeng/multiselect';
import { DropdownModule } from 'primeng/dropdown';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Device } from '../../models/device.model';
import { DeviceService } from '../../services/device-service';
import { DevicePaginatedData } from '../../models/paginated-data.model';
import { Router } from '@angular/router';
import { CardModule } from 'primeng/card';
import { PanelModule } from 'primeng/panel';

@Component({
  selector: 'app-device',
  standalone: true,
  imports: [
    TableModule,
    TagModule,
    InputTextModule,
    MultiSelectModule,
    DropdownModule,
    HttpClientModule,
    CommonModule,
    FormsModule,
    CardModule,
    PanelModule
  ],
  templateUrl: './devices.component.html',
  styleUrls: ['./devices.component.css'],
})
export class DevicesComponent implements OnInit, OnDestroy {
  devices: Device[] = [];
  loading: boolean = true;
  totalRecords: number = 0;
  filters: any = {};
  statuses: any[] = [];
  selectedStatus: string = '';
  private searchSubject = new Subject<any>();
  private destroy$ = new Subject<void>();

  constructor(private deviceService: DeviceService, private router: Router) {}

  ngOnInit() {
    this.statuses = [
      { label: 'OFF', value: 'OFF' },
      { label: 'ON', value: 'ON' },
      { label: 'STANDBY', value: 'STANDBY' },
    ];
    this.loadDevices({ first: 0, rows: 10 });

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
        console.log(this.devices);
        
        this.totalRecords = data.totalElements;
        this.loading = false;
      });
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

  navigateToDeviceDetail(deviceCode: string) {
    this.router.navigate(['/device', deviceCode]);
  }

  getSeverity(
    deviceStatus: string
  ):
    | 'success'
    | 'info'
    | 'warning'
    | 'danger'
    | 'secondary'
    | 'contrast'
    | undefined {
    switch (deviceStatus) {
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

  navigateToNewDevice() {
    this.router.navigate(['/device/new']);
  }
}
