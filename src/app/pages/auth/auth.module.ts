import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthComponent } from './auth.component';
import { AuthRoutingModule } from './auth-routing.module';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ForgotPasswordComponent } from '../../shared/components/auth/forgot-password/forgot-password.component';
import { ResetPasswordComponent } from '../../shared/components/auth/reset-password/reset-password.component';
import { SignupFormComponent } from '../../shared/components/auth/signup-form/signup-form.component';
import { LoginFormComponent } from '../../shared/components/auth/login-form/login-form.component';
import { OtpCheckComponent } from '../../shared/components/auth/otp-check/otp-check.component';

@NgModule({
  declarations: [
    AuthComponent,
    LoginFormComponent,
    SignupFormComponent,
    OtpCheckComponent,
    ForgotPasswordComponent,
    ResetPasswordComponent
  ],
  imports: [CommonModule, AuthRoutingModule, ReactiveFormsModule, RouterModule],
})
export class AuthModule {}
