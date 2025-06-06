import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_ENDPOINTS } from '../../config/api'; // Importa os endpoints da API
import { UserProfile } from '../model/user-profile.model'; // Importa o modelo do perfil do utilizador

@Injectable({
  providedIn: 'root', // Torna o serviço disponível em toda a aplicação
})
export class UserService {
  constructor(private http: HttpClient) {} // Injeta o serviço HttpClient para fazer requisições HTTP

  // Método para obter o perfil do utilizador
  getProfile(): Observable<UserProfile> {
    // Faz uma requisição GET para o endpoint do perfil do utilizador
    return this.http.get<UserProfile>(API_ENDPOINTS.user.profile, {
      withCredentials: true, // Inclui cookies na requisição
    });
  }

  // Método para atualizar o perfil do utilizador
  updateProfile(
    data: Partial<UserProfile> // Aceita um objeto parcial do modelo UserProfileResponse
  ): Observable<UserProfile> {
    // Faz uma requisição PUT para atualizar os dados do perfil do utilizador
    return this.http.put<UserProfile>(API_ENDPOINTS.user.profile, data);
  }

  deleteAccount(): Observable<any> {
    return this.http.delete(API_ENDPOINTS.user.deleteAccount, {
      withCredentials: true, 
    });
  }
}
