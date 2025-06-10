import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

import { DashboardComponent } from './dashboard.component';
import { SideNavDashboardComponent } from '../../shared/components/side-nav-dashboard/side-nav-dashboard.component';
import { RouterModule } from '@angular/router';
import { DashboardProfessionalsComponent } from '../../shared/components/dashboard-professionals/dashboard-professionals.component';
import { DashboardBusinessComponent } from '../../shared/components/dashboard-business/dashboard-business.component';
import { DashboardQueuesComponent } from '../../shared/components/dashboard-queues/dashboard-queues.component';
import { DashboardServicesComponent } from '../../shared/components/dashboard-services/dashboard-services.component';
import { DashboardRoutingModule } from './dashboard-routing.module';

@NgModule({
  declarations: [DashboardComponent, SideNavDashboardComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    RouterModule,
    DashboardRoutingModule,
    DashboardProfessionalsComponent,
    DashboardBusinessComponent,
    DashboardQueuesComponent,
    DashboardServicesComponent
  ],
  exports: [SideNavDashboardComponent],
})
export class DashboardModule {}
