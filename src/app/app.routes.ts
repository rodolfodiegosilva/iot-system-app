import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { MonitoringDashboardComponent } from './monitoring-dashboard/monitoring-dashboard.component';
import { AuthGuardService } from './auth-guard.service';
import { HomeComponent } from './home/home.component';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'monitoring-dashboard', component: MonitoringDashboardComponent, canActivate: [AuthGuardService] },
  { path: '', component: HomeComponent }
];
