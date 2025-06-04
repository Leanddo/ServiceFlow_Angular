import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_ENDPOINTS } from '../../config/api'; // Importa os endpoints da API
import { Router } from '@angular/router'; // Importa o Router para navegação

@Injectable({
  providedIn: 'root', // Torna o serviço disponível em toda a aplicação
})
export class AuthService {
  constructor(
    private http: HttpClient, // Serviço HTTP para fazer requisições
    private router: Router // Serviço de navegação para redirecionamentos
  ) {}

  // Método para login
  login(credentials: { email: string; password: string }): Observable<any> {
    return this.http.post(API_ENDPOINTS.auth.normalAuth.login, credentials, {
      withCredentials: true, // Inclui cookies na requisição
    });
  }

  // Método para cadastro de novos usuários
  signUp(credentials: {
    email: string;
    password: string;
    username: string;
  }): Observable<any> {
    return this.http.post(API_ENDPOINTS.auth.normalAuth.signup, credentials, {
      withCredentials: true, // Inclui cookies na requisição
    });
  }

  // Método para verificar o OTP (One-Time Password)
  verifyOTP(credentials: { otp: string }): Observable<any> {
    return this.http.post(API_ENDPOINTS.auth.otp.verify, credentials, {
      withCredentials: true, // Inclui cookies na requisição
    });
  }

  // Método para reenviar o OTP
  resendOTP(): Observable<any> {
    return this.http.get(API_ENDPOINTS.auth.otp.reSend, {
      withCredentials: true, // Inclui cookies na requisição
    });
  }

  // Método para solicitar redefinição de senha
  requestPasswordReset(data: { email: string }): Observable<any> {
    return this.http.post(API_ENDPOINTS.auth.password.forgotPassword, data);
  }

  // Método para redefinir a senha usando um token
  resetPassword(token: string, data: { newPassword: string }): Observable<any> {
    return this.http.post(
      API_ENDPOINTS.auth.password.forgotPasswordVerify(token), // Endpoint que verifica o token
      data
    );
  }

  // Método para verificar se o usuário está autenticado
  isAuthenticated(): boolean {
    // Exemplo simples: verifica se existe um cookie chamado 'authcookie'
    return document.cookie.includes('authcookie');
  }

  // Método para logout
  logout(): void {
    this.http.post(API_ENDPOINTS.auth.logout, {}, { withCredentials: true }) // Faz a requisição de logout
      .subscribe({
        next: () => {
          this.router.navigate(['/']); // Redireciona para a página inicial após logout com sucesso
        },
        error: (err) => {
          console.error('Erro ao fazer logout:', err); // Loga o erro no console
        }
      });
  }
}
