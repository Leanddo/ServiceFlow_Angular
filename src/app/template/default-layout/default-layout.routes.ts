import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';

const routes: Routes = [
    {path: '', loadChildren: () => import('../../pages/home/home.module').then((m) => m.HomeModule)},
    {path: 'services', loadChildren: () => import('../../pages/services/services.module').then((m) => m.ServicesModule)},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DefaultLayoutRoutingModule {}
