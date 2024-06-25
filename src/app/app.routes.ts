import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { HomeComponent } from './home/home.component';
import { AuthGuardService } from './services/auth-guard.service';
import { ErrorComponent } from './error/ErrorComponent ';
import { MonitoringsComponent } from './monitoring/monitoring-list/monitorings.component';
import { DevicesComponent } from './devices/devices-list/devices-component';
import { DeviceComponent } from './devices/device-detail/device.component';
import { MonitoringComponent } from './monitoring/monitoring-detail/monitoring.component';

export const appRoutes: Routes = [
  { path: 'login', component: LoginComponent },
  {
    path: 'monitorings',
    component: MonitoringsComponent,
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
    canActivate: [AuthGuardService],
  },
  {
    path: 'monitoring/:monitoringCode',
    component: MonitoringComponent,
    canActivate: [AuthGuardService],
  },
  { path: '', component: HomeComponent },
  { path: '**', component: ErrorComponent },
];
