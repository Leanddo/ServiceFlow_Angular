import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { API_ENDPOINTS } from '../../config/api'; // Importa os endpoints da API
import { Router } from '@angular/router'; // Importa o Router para navegação
import { UserProfile } from '../model/user-profile.model';

@Injectable({
  providedIn: 'root', // Torna o serviço disponível em toda a aplicação
})
export class AuthService {
  constructor(
    private http: HttpClient, // Serviço HTTP para fazer requisições
    private router: Router // Serviço de navegação para redirecionamentos
  ) {}

  private userSubject = new BehaviorSubject<UserProfile | null>(null);
  user$ = this.userSubject.asObservable();

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
    return this.http.post(API_ENDPOINTS.auth.password.forgotPassword, data, {
      withCredentials: true, // Inclui cookies na requisição
    });
  }

  // Método para redefinir a senha usando um token
  resetPassword(token: string, data: { newPassword: string }): Observable<any> {
    return this.http.post(
      API_ENDPOINTS.auth.password.forgotPasswordVerify(token), // Endpoint que verifica o token
      data,
      { withCredentials: true } // Inclui cookies na requisição
    );
  }

  // Método para verificar se o usuário está autenticado
  isAuthenticated(): boolean {
    // Exemplo simples: verifica se existe um cookie chamado 'authcookie'
    return document.cookie.includes('authcookie');
  }

  setUser(user: UserProfile | null): void {
    this.userSubject.next(user);
  }

  isLoggedIn(): Observable<boolean> {
    return this.http.get<boolean>(API_ENDPOINTS.auth.isLoggedIn, {
      withCredentials: true,
    });
  }

  // Método para logout
  logout(): void {
    this.http
      .post(API_ENDPOINTS.auth.logout, {}, { withCredentials: true }) // Faz a requisição de logout
      .subscribe({
        next: () => {
          this.setUser(null); // Garante que o usuário seja definido como null
          this.router.navigate(['/']); // Redireciona para a página inicial após logout com sucesso
        },
        error: (err) => {
          this.setUser(null); // Garante que o usuário seja definido como null mesmo em caso de erro
          console.log('User after logout (error):', this.userSubject.value); // Debug: verifica o estado do usuário
        },
      });
  }
}
