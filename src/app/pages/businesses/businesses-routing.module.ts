import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BusinessesComponent } from './businesses.component';
import { BusinessesListComponent } from '../../shared/components/businesses-list/businesses-list.component';
import { BusinessComponent } from '../../shared/components/business/business.component';

const routes: Routes = [
  {
    path: '',
    component: BusinessesComponent,
    children: [
      {
        path: '',
        component: BusinessesListComponent, // Carrega o componente standalone diretamente
      },
      {
        path: ':id',
        component: BusinessComponent, // Carrega o componente standalone diretamente
      },
    ],
  },  
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class businessesRoutingModule {}
