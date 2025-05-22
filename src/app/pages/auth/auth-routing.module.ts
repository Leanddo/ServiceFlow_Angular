import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthComponent } from './auth.component';
import { ForgotPasswordComponent } from '../../shared/components/auth/forgot-password/forgot-password.component';
import { ResetPasswordComponent } from '../../shared/components/auth/reset-password/reset-password.component';
import { LoginFormComponent } from '../../shared/components/auth/login-form/login-form.component';
import { SignupFormComponent } from '../../shared/components/auth/signup-form/signup-form.component';
import { OtpCheckComponent } from '../../shared/components/auth/otp-check/otp-check.component';

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
