import { Component } from '@angular/core';
import { FormControl } from '@angular/forms';
import { AuthService } from '../../../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-otp-check',
  templateUrl: './otp-check.component.html',
  styleUrl: './otp-check.component.scss',
})
export class OtpCheckComponent {
  otp: string[] = ['', '', '', '', '', ''];
  errorMessage: string = '';
  successMessage: string = '';

  inputs: FormControl[] = Array(6)
    .fill(null)
    .map(() => new FormControl(''));

  constructor(private authService: AuthService, private router: Router) {}

  onInput(index: number, event: Event) {
    const input = event.target as HTMLInputElement;
    const value = input.value;

    if (/^[0-9]$/.test(value)) {
      this.otp[index] = value;

      if (index < 5) {
        const nextInput = document.getElementById(
          `otp-${index + 1}`
        ) as HTMLInputElement;
        nextInput?.focus();
      }
    } else {
      input.value = '';
      this.otp[index] = '';
    }
  }

  onKeyDown(index: number, event: KeyboardEvent) {
    const input = event.target as HTMLInputElement;

    if (event.key === 'Backspace' && !input.value && index > 0) {
      const prevInput = document.getElementById(
        `otp-${index - 1}`
      ) as HTMLInputElement;
      prevInput?.focus();
    }
  }

  onPaste(event: ClipboardEvent) {
    event.preventDefault();

    const pastedData = event.clipboardData?.getData('text') || '';
    const digits = pastedData.replace(/\D/g, '').slice(0, 6); // apenas os 6 primeiros dígitos

    for (let i = 0; i < digits.length; i++) {
      this.otp[i] = digits[i];
      this.inputs[i].setValue(digits[i]);
    }

    // foca no último preenchido
    const nextInput = document.getElementById(
      `otp-${digits.length - 1}`
    ) as HTMLInputElement;
    nextInput?.focus();
  }

  submitOTP() {
    const otp = this.otp.join('');
    this.authService.verifyOTP({ otp }).subscribe({
      next: (res) => {
        const redirect = localStorage.getItem('redirectAfterLogin');
        if (redirect) {
          localStorage.removeItem('redirectAfterLogin');
          this.router.navigate([redirect]);
        } else {
          this.router.navigate(['/']);
        }
      },
      error: (err) => {
        this.errorMessage = 'Codigo inválido ou expirado.';
      },
    });
  }

  resendOTP(event: Event) {
    event.preventDefault();

    this.authService.resendOTP().subscribe({
      next: () => {
        this.successMessage = 'Codigo enviado com sucesso.';
      },
      error: (err) => {
        // mostrar erro
        this.errorMessage = 'Erro ao reenviar código.';
      },
    });
  }
}
