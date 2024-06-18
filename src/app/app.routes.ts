import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { MonitoringDashboardComponent } from './monitoring-dashboard/monitoring-dashboard.component';
import { HomeComponent } from './home/home.component';
import { AuthGuardService } from './services/auth-guard.service';
import { DeviceComponent } from './devices/DeviceComponent';
import { ErrorComponent } from './error/ErrorComponent ';

export const appRoutes: Routes = [
  { path: 'login', component: LoginComponent },
  {
    path: 'monitoringdashboard',
    component: MonitoringDashboardComponent,
    canActivate: [AuthGuardService],
  },
  {
    path: 'devices',
    component: DeviceComponent,
    canActivate: [AuthGuardService],
  },
  { path: '', component: HomeComponent },
  { path: '**', component: ErrorComponent },
];
