import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrl: './forgot-password.component.scss'
})
export class ForgotPasswordComponent {
  forgotForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email])
  });

  errorMessage = '';
  successMessage = '';
  isSubmitting = false;

  constructor(private authService: AuthService) {}

  onSubmit() {
    if (this.forgotForm.invalid) return;

    this.errorMessage = '';
    this.successMessage = '';
    this.isSubmitting = true;

    const email = this.forgotForm.get('email')?.value || '';

    console.log(email);
    

    this.authService.requestPasswordReset({ email }).subscribe({
      next: () => {
        this.successMessage = 'Email enviado! Verifique a sua caixa de entrada.';
        this.isSubmitting = false;
        this.forgotForm.reset();
      },
      error: (err) => {
        this.errorMessage = err.error?.message || 'Erro ao enviar email. Tente novamente.';
        this.isSubmitting = false;
      }
    });
  }
}
