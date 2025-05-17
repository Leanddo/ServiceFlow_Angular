import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthComponent } from './auth.component';
import { LoginFormComponent } from '../../shared/components/login-form/login-form.component';
import { SignupFormComponent } from '../../shared/components/signup-form/signup-form.component';
import { OtpCheckComponent } from '../../shared/components/otp-check/otp-check.component';
import { ForgotPasswordComponent } from '../../shared/components/forgot-password/forgot-password.component';
import { ResetPasswordComponent } from '../../shared/components/reset-password/reset-password.component';

const routes: Routes = [
  {
    path: '',
    component: AuthComponent,
    children: [
      { path: 'login', component: LoginFormComponent },
      { path: 'signup', component: SignupFormComponent },
      { path: 'verify', component: OtpCheckComponent },
      { path: 'forgot-password', component: ForgotPasswordComponent },
      { path: 'verify-password/:token', component: ResetPasswordComponent },
      { path: '', redirectTo: 'login', pathMatch: 'full' },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AuthRoutingModule {}
