import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthComponent } from './auth.component';
import { AuthRoutingModule } from './auth-routing.module';
import { LoginFormComponent } from '../../shared/components/login-form/login-form.component';
import { SignupFormComponent } from '../../shared/components/signup-form/signup-form.component';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { OtpCheckComponent } from '../../shared/components/otp-check/otp-check.component';
import { ForgotPasswordComponent } from '../../shared/components/forgot-password/forgot-password.component';
import { ResetPasswordComponent } from '../../shared/components/reset-password/reset-password.component';

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
