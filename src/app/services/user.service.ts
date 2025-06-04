import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_ENDPOINTS } from '../../config/api'; // Importa os endpoints da API
import { UserProfileResponse } from '../model/user-profile.model'; // Importa o modelo do perfil do utilizador

@Injectable({
  providedIn: 'root', // Torna o serviço disponível em toda a aplicação
})
export class UserService {
  constructor(private http: HttpClient) {} // Injeta o serviço HttpClient para fazer requisições HTTP

  // Método para obter o perfil do utilizador
  getProfile(): Observable<UserProfileResponse> {
    // Faz uma requisição GET para o endpoint do perfil do utilizador
    return this.http.get<UserProfileResponse>(API_ENDPOINTS.user.profile, {
      withCredentials: true, // Inclui cookies na requisição
    });
  }

  // Método para atualizar o perfil do utilizador
  updateProfile(
    data: Partial<UserProfileResponse> // Aceita um objeto parcial do modelo UserProfileResponse
  ): Observable<UserProfileResponse> {
    // Faz uma requisição PUT para atualizar os dados do perfil do utilizador
    return this.http.put<UserProfileResponse>(API_ENDPOINTS.user.profile, data);
  }


  /* deleteAccount(payload: { password: string }): Observable<any> {
    // O método DELETE geralmente não tem corpo, mas se sua API exige:
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
      body: payload
    };
    return this.http.delete(API_ENDPOINTS.user.deleteAccount, httpOptions);
    // Se for um POST para deletar (incomum mas possível):
    // return this.http.post(API_ENDPOINTS.user.deleteAccount, payload);
  } */
}
