import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms'; // Adicione esta importação
import { NavBarComponent } from './components/nav-bar/nav-bar.component';
import { FooterComponent } from './components/footer/footer.component';
import { ChangePasswordComponent } from './components/change-password/change-password.component';
import { ProfileDetailsComponent } from './components/profile-details/profile-details.component';
import { AppointmentsComponent } from './components/appointments/appointments.component';
import { DeleteAccountComponent } from './components/delete-account/delete-account.component';

@NgModule({
  declarations: [
    NavBarComponent,
    FooterComponent,
    ChangePasswordComponent,
    ProfileDetailsComponent,
    AppointmentsComponent,
    DeleteAccountComponent,
  ],
  imports: [
    CommonModule, // Certifique-se de que o CommonModule está importado aqui
    RouterModule,
    FormsModule,
  ],
  exports: [
    NavBarComponent,
    FooterComponent,
    ChangePasswordComponent,
    ProfileDetailsComponent,
    AppointmentsComponent,
    DeleteAccountComponent,
  ],
})
export class SharedModule {}
