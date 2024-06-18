import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { Monitoring } from '../models/monitoring.model';
import { PaginatedData } from '../models/paginated-data.model';
import { HttpClientModule } from '@angular/common/http';
import { MonitoringService } from '../services/monitoring.service';

@Component({
  selector: 'app-monitoring-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    HttpClientModule
  ],
  templateUrl: './monitoring-dashboard.component.html',
  styleUrls: ['./monitoring-dashboard.component.css']
})
export class MonitoringDashboardComponent implements OnInit {
  displayedColumns: string[] = ['monitoringCode', 'user', 'device', 'status', 'createdAt', 'updatedAt'];
  dataSource = new MatTableDataSource<Monitoring>();
  totalElements: number = 0;
  pageSize = 10;
  currentPage = 0;
  sortField = 'monitoringCode';
  sortDirection = 'asc';
  isLastPage = false;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private monitoringService: MonitoringService) {}

  ngOnInit() {
    this.loadMonitoringData(this.currentPage, this.pageSize, this.sortField, this.sortDirection);
  }

  loadMonitoringData(pageNo: number, pageSize: number, sortBy: string, sortDir: string) {
    this.monitoringService.getMonitoringData(pageNo, pageSize, sortBy, sortDir).subscribe((data: PaginatedData) => {
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
    this.loadMonitoringData(this.currentPage, this.pageSize, this.sortField, this.sortDirection);
  }
}