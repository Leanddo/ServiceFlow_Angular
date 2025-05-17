import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-signup-form',
  templateUrl: './signup-form.component.html',
  styleUrl: './signup-form.component.scss',
})
export class SignupFormComponent {
  signupForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.signupForm = this.fb.group(
      {
        username: ['', Validators.required],
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required, Validators.minLength(6)]],
        confirmPassword: ['', Validators.required],
      },
      {
        validators: this.passwordsMatchValidator,
      }
    );
  }

  private passwordsMatchValidator(form: FormGroup) {
    const password = form.get('password')?.value;
    const confirmPassword = form.get('confirmPassword')?.value;
    return password === confirmPassword ? null : { passwordsMismatch: true };
  }

  get passwordsMismatch() {
    return this.signupForm.errors?.['passwordsMismatch'];
  }


  onSubmit(): void {
    if (this.signupForm.valid) {
      const { username, email, password, confirmPassword } = this.signupForm.value;

    
      if (password !== confirmPassword) {
        alert('As palavras-passe não coincidem');
        return;
      }

      this.authService.signUp({ username, email, password }).subscribe({
        next: () => {
          // Guarda o e-mail localmente para usar na verificação OTP
          localStorage.setItem('pendingEmail', email);
          this.router.navigate(['/auth/verify']);
        },
        error: (err) => {
          console.error('Erro no signup:', err);
          alert('Erro ao registar. Verifica os dados e tenta novamente.');
        },
      });
    }
  }
}
