import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, forkJoin, of } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import { API_ENDPOINTS } from '../../config/api'; // ajusta o path conforme necessário
import { Business, Service, Rating } from '../model/business.model';

export interface BusinessWithExtras {
  business: Business;
  services: Service[];
  rating: Rating;
}

@Injectable({
  providedIn: 'root'
})
export class BusinessService {
  constructor(private http: HttpClient) {}

  getAllBusinesses(filters?: { business_type?: string; name?: string }): Observable<BusinessWithExtras[]> {
    // Montar query params a partir do filtro
    let params = new URLSearchParams();
    if (filters?.business_type) {
      params.append('business_type', filters.business_type);
    }
    if (filters?.name) {
      params.append('name', filters.name);
    }
  
    const url = API_ENDPOINTS.businesses.getAll + (params.toString() ? `?${params.toString()}` : '');
  
    return this.http.get<Business[]>(url).pipe(
      switchMap((businesses) => {
        if (!businesses || businesses.length === 0) {
          return of([]);
        }
        const requests = businesses.map((business) =>
          forkJoin({
            services: this.getBusinessServices(business.business_id).pipe(catchError(() => of([]))),
            rating: this.getBusinessRating(business.business_id).pipe(catchError(() => of({ average_rating: 0, total_reviews: 0 } as Rating)))
          }).pipe(
            map(({ services, rating }) => ({
              business,
              services,
              rating
            }))
          )
        );
        return forkJoin(requests);
      }),
      catchError(() => of([]))
    );
  }
  

  getBusinessServices(businessId: number): Observable<Service[]> {
    // Corrige URL caso getById retorne caminho completo ou parcial
    return this.http.get<Service[]>(API_ENDPOINTS.businesses.services.getBusinessService(businessId.toString()));
  }

  getBusinessRating(businessId: number): Observable<Rating> {
    return this.http.get<Rating>(API_ENDPOINTS.rating.getBusinessRating(businessId.toString()));
  }
}
