import { Component, OnInit } from '@angular/core';
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
  imports: [
    CommonModule,
    FormsModule,
    BreadcrumbModule
  ]
})
export class MonitoringComponent implements OnInit {
  monitoring: any;
  errorMessage: string | undefined;
  breadcrumbItems: MenuItem[];

  constructor(
    private route: ActivatedRoute,
    private monitoringService: MonitoringService,
    private router: Router
  ) {
    this.breadcrumbItems = [];
  }

  ngOnInit(): void {
    const monitoringCode = this.route.snapshot.paramMap.get('monitoringCode');
    if (monitoringCode) {
      this.monitoringService.getMonitoringByCode(monitoringCode).subscribe({
        next: (data: any) => {
          console.log('Monitoring data received:', data); // Debug log
          this.monitoring = data;
          this.errorMessage = undefined;
          this.setBreadcrumbItems(); // Set breadcrumbs after data is loaded
        },
        error: (error) => {
          console.error('Error fetching monitoring data:', error); // Error log
          this.errorMessage = 'Monitoring not found'; // Set error message
          this.monitoring = undefined; // Clear any previous monitoring data
        },
      });
    }

    this.breadcrumbItems = [
      { label: 'Monitorings', routerLink: ['/monitorings'] },
      { label: 'Monitoring Detail', disabled: true }
    ];
  }

  setBreadcrumbItems(): void {
    this.breadcrumbItems = [
      { label: 'Monitorings', routerLink: ['/monitorings'] },
      { label: this.monitoring?.monitoringCode || 'Monitoring Detail', disabled: true }
    ];
  }

  viewDevice(deviceCode: string): void {
    this.router.navigate(['/device', deviceCode]);
  }
}
