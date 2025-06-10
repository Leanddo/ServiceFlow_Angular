import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardProfessionalsComponent } from '../../shared/components/dashboard-professionals/dashboard-professionals.component';
import { DashboardQueuesComponent } from '../../shared/components/dashboard-queues/dashboard-queues.component';
import { DashboardBusinessComponent } from '../../shared/components/dashboard-business/dashboard-business.component';
import { DashboardServicesComponent } from '../../shared/components/dashboard-services/dashboard-services.component';
import { DashboardComponent } from './dashboard.component';

const routes: Routes = [
  {
    path: '',
    component: DashboardComponent,
    children: [
      {
        path: 'professionals/:businessId',
        component: DashboardProfessionalsComponent,
      },
      {
        path: 'queues/:businessId',
        component: DashboardQueuesComponent,
      },
      {
        path: 'business/:businessId',
        component: DashboardBusinessComponent,
      },
      {
        path: 'services/:businessId',
        component: DashboardServicesComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DashboardRoutingModule {}
