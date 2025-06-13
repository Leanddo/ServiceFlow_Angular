// src/app/features/user-account/user-account-routing.module.ts
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UserAccountPageComponent } from './user-account-page.component';
import { ProfileDetailsComponent } from '../../shared/components/profile-details/profile-details.component';
import { DeleteAccountComponent } from '../../shared/components/delete-account/delete-account.component';
import { AppointmentsComponent } from '../../shared/components/appointments/appointments.component';

const routes: Routes = [
  {
    path: '',
    component: UserAccountPageComponent,
    children: [
      {
        path: 'details',
        component: ProfileDetailsComponent,
        data: { title: 'Detalhes do Perfil' },
      },
      {
        path: 'delete-account',
        component: DeleteAccountComponent,
        data: { title: 'Excluir Conta' },
      },
      {
        path: 'appointments',
        component: AppointmentsComponent,
        data: { title: 'Agendamentos' },
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UserAccountRoutingModule {

}
