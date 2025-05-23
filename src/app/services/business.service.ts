import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, forkJoin, of } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import { API_ENDPOINTS } from '../../config/api'; // ajusta o path conforme necessário
import {
  Business,
  Service,
  Rating,
  Photo,
  Professionals,
} from '../model/business.model';

export interface BusinessWithExtras {
  business: Business;
  services: Service[];
  rating: Rating;
  photos?: Photo[];
  professionals?: Professionals[];
}

@Injectable({
  providedIn: 'root',
})
export class BusinessService {
  constructor(private http: HttpClient) {}

  getAllBusinesses(filters?: {
    business_type?: string;
    name?: string;
  }): Observable<BusinessWithExtras[]> {
    // Montar query params a partir do filtro
    let params = new URLSearchParams();
    if (filters?.business_type) {
      params.append('business_type', filters.business_type);
    }
    if (filters?.name) {
      params.append('name', filters.name);
    }

    const url =
      API_ENDPOINTS.businesses.getAll +
      (params.toString() ? `?${params.toString()}` : '');

    return this.http.get<Business[]>(url).pipe(
      switchMap((businesses) => {
        if (!businesses || businesses.length === 0) {
          return of([]);
        }
        const requests = businesses.map((business) =>
          forkJoin({
            services: this.getBusinessServices(business.business_id).pipe(
              catchError(() => of([]))
            ),
            rating: this.getBusinessRating(business.business_id).pipe(
              catchError(() =>
                of({ average_rating: 0, total_reviews: 0 } as Rating)
              )
            ),
          }).pipe(
            map(({ services, rating }) => ({
              business,
              services,
              rating,
            }))
          )
        );
        return forkJoin(requests);
      }),
      catchError(() => of([]))
    );
  }

  getBusinessById(businessId: number): Observable<BusinessWithExtras | null> {
    return this.http
      .get<Business>(API_ENDPOINTS.businesses.getById(businessId))
      .pipe(
        switchMap((business) => {
          if (!business) {
            return of(null);
          }

          return forkJoin({
            services: this.getBusinessServices(business.business_id).pipe(
              catchError(() => of([]))
            ),
            rating: this.getBusinessRating(business.business_id).pipe(
              catchError(() =>
                of({ average_rating: 0, total_reviews: 0 } as Rating)
              )
            ),
            photos: this.getBusinessPhotos(business.business_id).pipe(
              catchError(() => of([]))
            ),
            professionals: this.getPublicBusinessProfessionals(
              business.business_id
            ).pipe(catchError(() => of([]))),
          }).pipe(
            map(({ services, rating, photos, professionals }) => ({
              business,
              services,
              rating,
              photos,
              professionals,
            }))
          );
        }),
        catchError(() => of(null))
      );
  }

  getPublicBusinessProfessionals(
    businessId: number
  ): Observable<Professionals[]> {
    return this.http.get<Professionals[]>(
      API_ENDPOINTS.businesses.professionals.getPublicBusinessProfessionalsById(
        businessId
      )
    );
  }

  getBusinessPhotos(businessId: number): Observable<Photo[]> {
    return this.http.get<Photo[]>(
      API_ENDPOINTS.businesses.photos.getBusinessPhotos(businessId)
    );
  }

  getBusinessServices(businessId: number): Observable<Service[]> {
    return this.http.get<Service[]>(
      API_ENDPOINTS.businesses.services.getBusinessService(businessId)
    );
  }

  getBusinessRating(businessId: number): Observable<Rating> {
    return this.http.get<Rating>(
      API_ENDPOINTS.rating.getBusinessRating(businessId)
    );
  }
}
