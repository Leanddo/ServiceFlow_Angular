import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router'; // Importa os módulos de roteamento do Angular
import { AuthComponent } from './auth.component'; // Componente principal da página de autenticação
import { ForgotPasswordComponent } from '../../shared/components/auth/forgot-password/forgot-password.component'; // Componente para a funcionalidade de "Esqueci minha senha"
import { ResetPasswordComponent } from '../../shared/components/auth/reset-password/reset-password.component'; // Componente para redefinir a senha
import { LoginFormComponent } from '../../shared/components/auth/login-form/login-form.component'; // Componente para o formulário de login
import { SignupFormComponent } from '../../shared/components/auth/signup-form/signup-form.component'; // Componente para o formulário de cadastro
import { OtpCheckComponent } from '../../shared/components/auth/otp-check/otp-check.component'; // Componente para verificação de OTP (One-Time Password)

// Define as rotas para o módulo de autenticação
const routes: Routes = [
  {
    path: '', // Rota base para o módulo de autenticação
    component: AuthComponent, // Componente principal que será renderizado
    children: [
      { path: 'login', component: LoginFormComponent }, // Rota para o formulário de login
      { path: 'signup', component: SignupFormComponent }, // Rota para o formulário de cadastro
      { path: 'verify', component: OtpCheckComponent }, // Rota para verificação de OTP
      { path: 'forgot-password', component: ForgotPasswordComponent }, // Rota para "Esqueci minha senha"
      { path: 'verify-password/:token', component: ResetPasswordComponent }, // Rota para redefinir a senha com um token
      { path: '', redirectTo: 'login', pathMatch: 'full' }, // Redireciona para a rota de login por padrão
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)], // Configura as rotas como rotas filhas
  exports: [RouterModule], // Exporta o módulo de rotas para ser usado em outros módulos
})
export class AuthRoutingModule {}
