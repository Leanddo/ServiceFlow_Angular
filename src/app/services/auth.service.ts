import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_ENDPOINTS } from '../../config/api';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(
    private http: HttpClient,
    private router: Router // Adicione o Router aqui
  ) {}

  login(credentials: { email: string; password: string }): Observable<any> {
    return this.http.post(API_ENDPOINTS.auth.normalAuth.login, credentials, {
      withCredentials: true,
    });
  }

  signUp(credentials: {
    email: string;
    password: string;
    username: string;
  }): Observable<any> {
    return this.http.post(API_ENDPOINTS.auth.normalAuth.signup, credentials, {
      withCredentials: true,
    });
  }

  verifyOTP(credentials: { otp: string }): Observable<any> {
    return this.http.post(API_ENDPOINTS.auth.otp.verify, credentials, {
      withCredentials: true, // para enviar cookie com o token
    });
  }

  resendOTP(): Observable<any> {
    return this.http.get(API_ENDPOINTS.auth.otp.reSend, {
      withCredentials: true,
    });
  }

  requestPasswordReset(data: { email: string }): Observable<any> {
    return this.http.post(API_ENDPOINTS.auth.password.forgotPassword, data);
  }

  resetPassword(token: string, data: { newPassword: string }): Observable<any> {
    return this.http.post(
      API_ENDPOINTS.auth.password.forgotPasswordVerify(token),
      data
    );
  }

  isAuthenticated(): boolean {
    // Exemplo simples: verifica se existe um cookie ou flag
    return document.cookie.includes('authcookie');
  }


  logout(): void {
    this.http.post(API_ENDPOINTS.auth.logout, {}, { withCredentials: true }).subscribe({
      next: () => {
        this.router.navigate(['/']); // Redireciona após logout com sucesso
      },
      error: (err) => {
        console.error('Erro ao fazer logout:', err);
      }
    });
  }
  
}
