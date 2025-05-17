import { RouterModule, Routes } from '@angular/router';
import { DefaultLayoutComponent } from './template/default-layout/default-layout.component';
import { NgModule } from '@angular/core';

const routes: Routes = [
  {
    path: '',
    component: DefaultLayoutComponent,
    loadChildren: () =>
      import('./template/default-layout/default-layout.module').then(
        (m) => m.DefaultLayoutModule
      ),
  },
  {
    path: '',
    loadChildren: () =>
      import('./template/blank-layout/blank-layout.module').then(
        (m) => m.BlankLayoutModule
      ),
  },
  { path: '**', redirectTo: '' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
