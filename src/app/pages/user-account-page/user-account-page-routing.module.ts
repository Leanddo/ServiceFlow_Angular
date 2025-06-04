// src/app/features/user-account/user-account-routing.module.ts
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UserAccountPageComponent } from './user-account-page.component';
import { ProfileDetailsSettingsComponent } from '../../shared/components/profile-details-settings/profile-details-settings.component';
import { AccountSettingsComponent } from '../../shared/components/account-settings/account-settings.component';

const routes: Routes = [
  {
    path: '',
    component: UserAccountPageComponent,
    children: [
      { path: '', redirectTo: 'details', pathMatch: 'full' }, // Rota padrão
      {
        path: 'profile',
        component: ProfileDetailsSettingsComponent,
        data: { title: 'Página inicial do perfil' },
      },
      {
        path: 'account',
        component: AccountSettingsComponent,
        data: { title: 'Alterar Senha' },
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UserAccountRoutingModule {}
