import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, takeUntil } from 'rxjs/operators';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { HttpClientModule } from '@angular/common/http';
import { InputTextModule } from 'primeng/inputtext';
import { MultiSelectModule } from 'primeng/multiselect';
import { DropdownModule } from 'primeng/dropdown';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Monitoring } from '../../models/monitoring.model';
import { DeviceService } from '../../services/device-service';
import { PaginatedData } from '../../models/paginated-data.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-device-monitoring',
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
  ],
  templateUrl: './device-monitoring.component.html',
  styleUrls: ['./device-monitoring.component.css'],
})
export class DeviceMonitoringComponent implements OnInit, OnDestroy {
  @Input() deviceCode!: string;
  monitorings: Monitoring[] = [];
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
    this.loadMonitorings({ first: 0, rows: 10 });

    this.searchSubject.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      takeUntil(this.destroy$)
    ).subscribe((filters) => {
      this.filters = filters;
      this.loadMonitorings({ first: 0, rows: 10 });
    });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadMonitorings(event: any) {
    this.loading = true;
    const page = event.first / event.rows;
    const size = event.rows;
    const sortBy = event.sortField || 'monitoringCode';
    const sortDir = event.sortOrder === 1 ? 'asc' : 'desc';

    this.deviceService
      .getMonitorings(this.deviceCode, page, size, sortBy, sortDir, this.filters)
      .subscribe((data: PaginatedData) => {
        this.monitorings = data.content;
        this.totalRecords = data.totalElements;
        this.loading = false;
      });
  }

  clearFilters() {
    this.filters = {};
    this.loadMonitorings({ first: 0, rows: 10 });
  }

  onFilter(event: any, field: string) {
    const updatedFilters = { ...this.filters, [field]: event.target.value || '' };
    this.searchSubject.next(updatedFilters);
  }

  onFilterDropdown(event: any, field: string) {
    const updatedFilters = { ...this.filters, [field]: event.value || '' };
    this.searchSubject.next(updatedFilters);
  }

  navigateToMonitoringDetail(monitoringCode: string) {
    this.router.navigate(['/monitoring', monitoringCode]);
  }

  getSeverity(status: string): "success" | "info" | "warning" | "danger" | "secondary" | "contrast" | undefined {
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
