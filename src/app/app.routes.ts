import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { HomeComponent } from './home/home.component';
import { MonitoringsComponent } from './monitoring/monitoring-list/monitorings.component';
import { DevicesComponent } from './devices/devices-list/devices-component';
import { DeviceComponent } from './devices/device-detail/device.component';
import { NewDeviceComponent } from './devices/new-device/new-device.component';
import { NewMonitoringComponent } from './monitoring/new-monitoring/new-monitoring.component';
import { PreviewMonitoringComponent } from './monitoring/preview-monitoring/preview-monitoring.component';
import { MonitoringComponent } from './monitoring/monitoring-detail/monitoring.component';
import { authGuard } from './services/auth-guard.service';
import { ErrorComponent } from './error/ErrorComponent ';

export const appRoutes: Routes = [
  { path: 'login', component: LoginComponent, canActivate: [authGuard] },
  { path: 'register', component: RegisterComponent, canActivate: [authGuard] },
  {
    path: 'monitorings',
    component: MonitoringsComponent,
    canActivate: [authGuard],
  },
  {
    path: 'monitoring/new',
    component: NewMonitoringComponent,
    canActivate: [authGuard],
  },
  {
    path: 'monitoring/preview',
    component: PreviewMonitoringComponent,
    canActivate: [authGuard],
  },
  {
    path: 'devices',
    component: DevicesComponent,
    canActivate: [authGuard],
  },
  {
    path: 'device/new',
    component: NewDeviceComponent,
    canActivate: [authGuard],
  },
  {
    path: 'device/:deviceCode',
    component: DeviceComponent,
    canActivate: [authGuard],
  },
  {
    path: 'monitoring/:monitoringCode',
    component: MonitoringComponent,
    canActivate: [authGuard],
  },
  { path: '', component: HomeComponent },
  { path: '**', component: ErrorComponent },
];
