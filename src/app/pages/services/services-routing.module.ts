import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ServicesComponent } from './services.component';
import { BusinessesListComponent } from '../../shared/components/businesses-list/businesses-list.component';

const routes: Routes = [
  {
    path: '',
    component: ServicesComponent,
    children: [
      { path: '', component: BusinessesListComponent},
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ServicesRoutingModule {}
