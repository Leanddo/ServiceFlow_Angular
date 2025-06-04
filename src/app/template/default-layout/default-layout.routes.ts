import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';

const routes: Routes = [
  { path: '', loadChildren: () => import('../../pages/home/home.module').then((m) => m.HomeModule) },
  { path: 'businesses', loadChildren: () => import('../../pages/businesses/businesses.module').then((m) => m.BusinessesModule) },
  { path: 'user/account', loadChildren: () => import('../../pages/user-account-page/user-account-page.module').then((m) => m.UserAccountModule) },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DefaultLayoutRoutingModule {}
