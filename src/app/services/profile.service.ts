import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_ENDPOINTS } from '../../config/api'; // Importa os endpoints da API

@Injectable({
  providedIn: 'root',
})
export class ProfileService {
  constructor(private http: HttpClient) {}

  getProfileDetails(): Observable<any> {
    return this.http.get(API_ENDPOINTS.user.profile, { withCredentials: true });
  }

  updateProfileImage(imageData: FormData): Observable<any> {
    return this.http.post(API_ENDPOINTS.user.profileImage, imageData, {
      withCredentials: true,
    });
  }

  changePassword(oldPassword: string, newPassword: string): Observable<any> {
    return this.http.post(
      API_ENDPOINTS.user.changePassword,
      { oldPassword, newPassword },
      { withCredentials: true }
    );
  }

  deleteAccount(): Observable<any> {
    return this.http.delete(API_ENDPOINTS.user.deleteAccount, {
      withCredentials: true,
    });
  }

  uploadProfileImage(file: File): Observable<any> {
    const formData = new FormData();
    formData.append('foto', file);

    return this.http.put(API_ENDPOINTS.user.profileImage, formData, {
      withCredentials: true,
    });
  }
}
