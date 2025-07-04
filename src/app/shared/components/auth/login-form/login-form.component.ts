import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../../../services/auth.service';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { API_ENDPOINTS } from '../../../../../config/api';

@Component({
  selector: 'app-login-form',
  templateUrl: './login-form.component.html',
  styleUrls: ['./login-form.component.scss'],
})
export class LoginFormComponent implements OnInit {
  loginForm!: FormGroup;
  errorMessage: string = '';

  constructor(
    private readonly fb: FormBuilder,
    private readonly authService: AuthService,
    private readonly router: Router
  ) {}

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
    });
  }

  async onLogin(): Promise<void> {
    this.errorMessage = '';

    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    const { email, password } = this.loginForm.value;

    try {
      await firstValueFrom(this.authService.login({ email, password }));

      const redirect = localStorage.getItem('redirectAfterLogin');
      if (redirect) {
        localStorage.removeItem('redirectAfterLogin');
        await this.router.navigate([redirect]);
      } else {
        await this.router.navigate(['/']);
      }
      
    } catch (err: any) {
      if (
        err.status === 403 &&
        err.error?.error?.includes('Conta não verificada')
      ) {
        try {
          await firstValueFrom(this.authService.resendOTP());
        } catch {
          this.errorMessage = 'Erro ao reenviar código.';
        }
        await this.router.navigate(['/auth/verify']);
      } else {
        this.errorMessage = 'Email ou password incorretos.';
      }
    }
  }

  onGoogleSignup(): void {
    window.location.href = API_ENDPOINTS.auth.google.login;
  }
}
