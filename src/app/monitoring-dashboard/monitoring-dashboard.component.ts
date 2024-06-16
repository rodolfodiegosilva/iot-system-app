// src/app/monitoring-dashboard/monitoring-dashboard.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MonitoringService } from '../monitoring.service';
import { Monitoring } from '../models/monitoring.model';

@Component({
  selector: 'app-monitoring-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './monitoring-dashboard.component.html',
  styleUrls: ['./monitoring-dashboard.component.css']
})
export class MonitoringDashboardComponent implements OnInit {
  monitoringData: Monitoring[] = [];

  constructor(private monitoringService: MonitoringService) {}

  ngOnInit() {
    this.monitoringService.getMonitoringData().subscribe(data => {
      this.monitoringData = data;
    });
  }
}
