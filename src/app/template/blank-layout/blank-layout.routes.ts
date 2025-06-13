import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BlankLayoutComponent } from './blank-layout.component';
import { DashboardComponent } from '../../pages/dashboard/dashboard.component';
import { CreateReviewComponent } from '../../shared/components/create-review/create-review.component';

const routes: Routes = [
  {
    path: '',
    component: BlankLayoutComponent,
    children: [
      {
        path: 'auth',
        loadChildren: () =>
          import('../../pages/auth/auth.module').then((m) => m.AuthModule),
      },
      {
        path: 'create-business',
        loadChildren: () =>
          import('../../pages/create-business/create-business.module').then(
            (m) => m.CreateBusinessModule
          ),
      },
      {
        path: 'dashboard',
        loadChildren: () =>
          import('../../pages/dashboard/dashboard.module').then(
            (m) => m.DashboardModule
          ),
      },
      {
        path: 'business/:business_id/review/:service_id',
        component: CreateReviewComponent
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BlankLayoutRoutingModule {}
