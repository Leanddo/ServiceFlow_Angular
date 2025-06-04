import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common'; // Módulo Angular com diretivas comuns (ngIf, ngFor, etc.)
import { AuthComponent } from './auth.component'; // Componente principal da página de autenticação
import { AuthRoutingModule } from './auth-routing.module'; // Módulo de rotas para a página de autenticação
import { ReactiveFormsModule } from '@angular/forms'; // Módulo para trabalhar com formulários reativos
import { RouterModule } from '@angular/router'; // Módulo para navegação e rotas
import { ForgotPasswordComponent } from '../../shared/components/auth/forgot-password/forgot-password.component'; // Componente para a funcionalidade de "Esqueci minha senha"
import { ResetPasswordComponent } from '../../shared/components/auth/reset-password/reset-password.component'; // Componente para redefinir a senha
import { SignupFormComponent } from '../../shared/components/auth/signup-form/signup-form.component'; // Componente para o formulário de cadastro
import { LoginFormComponent } from '../../shared/components/auth/login-form/login-form.component'; // Componente para o formulário de login
import { OtpCheckComponent } from '../../shared/components/auth/otp-check/otp-check.component'; // Componente para verificação de OTP (One-Time Password)

@NgModule({
  declarations: [
    AuthComponent, // Declara o componente principal da página de autenticação
    LoginFormComponent, // Declara o componente de login
    SignupFormComponent, // Declara o componente de cadastro
    OtpCheckComponent, // Declara o componente de verificação de OTP
    ForgotPasswordComponent, // Declara o componente de "Esqueci minha senha"
    ResetPasswordComponent, // Declara o componente de redefinição de senha
  ],
  imports: [
    CommonModule, // Importa funcionalidades comuns do Angular
    AuthRoutingModule, // Importa as rotas específicas para a página de autenticação
    ReactiveFormsModule, // Importa o módulo para trabalhar com formulários reativos
    RouterModule, // Importa o módulo de rotas para navegação
  ],
})
export class AuthModule {}
