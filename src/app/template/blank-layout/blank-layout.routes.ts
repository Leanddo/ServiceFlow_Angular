import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BlankLayoutComponent } from './blank-layout.component';

const routes: Routes = [
  {
    path: '',
    component: BlankLayoutComponent,
    children: [
      { path: 'auth', loadChildren: () => import('../../pages/auth/auth.module').then((m) => m.AuthModule)},
      { path: 'create-business', loadChildren: () => import('../../pages/create-business/create-business.module').then((m) => m.CreateBusinessModule)},
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BlankLayoutRoutingModule {}
