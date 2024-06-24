import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { MonitoringDashboardComponent } from './monitoring-dashboard/monitoring-dashboard.component';
import { HomeComponent } from './home/home.component';
import { AuthGuardService } from './services/auth-guard.service';
import { ErrorComponent } from './error/ErrorComponent ';
import { DevicesComponent } from './devices/devices-list/devices-component';
import { DeviceComponent } from './devices/device-detail/device.component';

export const appRoutes: Routes = [
  { path: 'login', component: LoginComponent },
  {
    path: 'monitoringdashboard',
    component: MonitoringDashboardComponent,
    canActivate: [AuthGuardService],
  },
  {
    path: 'devices',
    component: DevicesComponent,
    canActivate: [AuthGuardService],
  },
  {
    path: 'device/:deviceCode',
    component: DeviceComponent,
    canActivate: [AuthGuardService]
  },
  { path: '', component: HomeComponent },
  { path: '**', component: ErrorComponent },
];
