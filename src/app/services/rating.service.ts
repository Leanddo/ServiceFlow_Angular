import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_ENDPOINTS } from '../../config/api'; // Importa os endpoints da API

@Injectable({
  providedIn: 'root',
})
export class RatingService {
  constructor(private http: HttpClient) {}

  getBusinessRatingAvg(id: number): Observable<any> {
    return this.http.get(API_ENDPOINTS.rating.getBusinessRatingAvg(id));
  }

  getBusinessReviews(id: number): Observable<any[]> {
    return this.http.get<any[]>(API_ENDPOINTS.rating.getBusinessReviews(id));
  }
}
