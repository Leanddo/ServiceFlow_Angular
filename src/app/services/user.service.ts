import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_ENDPOINTS } from '../../config/api';
import { UserProfileResponse } from '../model/user-profile.model';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(private http: HttpClient) {}

  // Obter perfil do utilizador
  getProfile(): Observable<UserProfileResponse> {
    return this.http.get<UserProfileResponse>(API_ENDPOINTS.user.profile, {
      withCredentials: true,
    });
  }

  // Atualizar perfil do utilizador
  updateProfile(
    data: Partial<UserProfileResponse>
  ): Observable<UserProfileResponse> {
    return this.http.put<UserProfileResponse>(API_ENDPOINTS.user.profile, data);
  }
}
