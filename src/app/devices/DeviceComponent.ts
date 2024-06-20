import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import {
  MatPaginator,
  MatPaginatorModule,
  PageEvent,
} from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { HttpClientModule } from '@angular/common/http';
import { Device } from '../models/device.model';
import { DevicePaginatedData } from '../models/paginated-data.model';
import { DeviceService } from '../services/DeviceService';

@Component({
  selector: 'app-device',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    HttpClientModule,
  ],
  templateUrl: './device.component.html',
  styleUrls: ['./device.component.css'],
})
export class DeviceComponent implements OnInit {
  displayedColumns: string[] = [
    'deviceCode',
    'name',
    'description',
    'status',
    'industryType',
    'user',
    'createdAt',
  ];
  dataSource = new MatTableDataSource<Device>();
  totalElements: number = 0;
  pageSize = 5;
  currentPage = 0;
  sortField = 'deviceCode';
  sortDirection = 'asc';
  isLastPage = false;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private deviceService: DeviceService) {}

  ngOnInit() {
    this.loadDeviceData(
      this.currentPage,
      this.pageSize,
      this.sortField,
      this.sortDirection
    );
  }

  loadDeviceData(
    pageNo: number,
    pageSize: number,
    sortBy: string,
    sortDir: string
  ) {
    this.deviceService
      .getDevices(pageNo, pageSize, sortBy, sortDir)
      .subscribe((data: DevicePaginatedData) => {
        console.log(data);

        this.dataSource.data = data.content;
        this.totalElements = data.totalElements;
        this.isLastPage = data.last;
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      });
  }

  onPaginateChange(event: PageEvent) {
    console.log(event);

    this.currentPage = event.pageIndex;
    this.pageSize = event.pageSize;
    this.loadDeviceData(
      this.currentPage,
      this.pageSize,
      this.sortField,
      this.sortDirection
    );
  }
}
