import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, forkJoin, of } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import { API_ENDPOINTS } from '../../config/api'; // Importa os endpoints da API
import {
  Business,
  Service,
  Rating,
  Photo,
  Professionals,
  BusinessReviewsResponse,
} from '../model/business.model'; // Importa os modelos necessários

// Interface que combina os dados do negócio com informações adicionais
export interface BusinessWithExtras {
  business: Business; // Dados do negócio
  services: Service[]; // Lista de serviços do negócio
  rating: Rating; // Avaliação média do negócio
  photos?: Photo[]; // Fotos do negócio (opcional)
  professionals?: Professionals[]; // Lista de profissionais do negócio (opcional)
}

@Injectable({
  providedIn: 'root', // Torna o serviço disponível em toda a aplicação
})
export class BusinessService {
  constructor(private http: HttpClient) {} // Injeta o serviço HttpClient para requisições HTTP

  // Método para buscar todos os negócios com filtros opcionais
  getAllBusinesses(filters?: { business_type?: string; name?: string }): Observable<BusinessWithExtras[]> {
    // Monta os parâmetros de consulta (query params) com base nos filtros fornecidos
    let params = new URLSearchParams();
    if (filters?.business_type) {
      params.append('business_type', filters.business_type);
    }
    if (filters?.name) {
      params.append('name', filters.name);
    }

    // Monta a URL com os parâmetros de consulta
    const url =
      API_ENDPOINTS.businesses.getAll +
      (params.toString() ? `?${params.toString()}` : '');

    // Faz a requisição para buscar os negócios
    return this.http.get<Business[]>(url).pipe(
      switchMap((businesses) => {
        // Se não houver negócios, retorna um array vazio
        if (!businesses || businesses.length === 0) {
          return of([]);
        }

        // Para cada negócio, busca os serviços e a avaliação média
        const requests = businesses.map((business) =>
          forkJoin({
            services: this.getBusinessServices(business.business_id).pipe(
              catchError(() => of([])) // Retorna um array vazio em caso de erro
            ),
            rating: this.getBusinessRating(business.business_id).pipe(
              catchError(() =>
                of({ average_rating: 0, total_reviews: 0 } as Rating) // Retorna uma avaliação padrão em caso de erro
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

        // Retorna um array com os dados combinados de todos os negócios
        return forkJoin(requests);
      }),
      catchError(() => of([])) // Retorna um array vazio em caso de erro na requisição principal
    );
  }

  // Método para buscar os detalhes de um negócio específico pelo ID
  getBusinessById(businessId: number): Observable<BusinessWithExtras | null> {
    return this.http
      .get<Business>(API_ENDPOINTS.businesses.getById(businessId)) // Faz a requisição para buscar o negócio
      .pipe(
        switchMap((business) => {
          // Se o negócio não for encontrado, retorna null
          if (!business) {
            return of(null);
          }

          // Busca os serviços, avaliação, fotos e profissionais do negócio
          return forkJoin({
            services: this.getBusinessServices(business.business_id).pipe(
              catchError(() => of([])) // Retorna um array vazio em caso de erro
            ),
            rating: this.getBusinessRating(business.business_id).pipe(
              catchError(() =>
                of({ average_rating: 0, total_reviews: 0 } as Rating) // Retorna uma avaliação padrão em caso de erro
              )
            ),
            photos: this.getBusinessPhotos(business.business_id).pipe(
              catchError(() => of([])) // Retorna um array vazio em caso de erro
            ),
            professionals: this.getPublicBusinessProfessionals(
              business.business_id
            ).pipe(catchError(() => of([]))), // Retorna um array vazio em caso de erro
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
        catchError(() => of(null)) // Retorna null em caso de erro na requisição principal
      );
  }

  // Método para buscar os profissionais públicos de um negócio
  getPublicBusinessProfessionals(businessId: number): Observable<Professionals[]> {
    return this.http.get<Professionals[]>(
      API_ENDPOINTS.businesses.professionals.getPublicBusinessProfessionalsById(
        businessId
      )
    );
  }

  // Método para buscar as fotos de um negócio
  getBusinessPhotos(businessId: number): Observable<Photo[]> {
    return this.http.get<Photo[]>(
      API_ENDPOINTS.businesses.photos.getBusinessPhotos(businessId)
    );
  }

  // Método para buscar os serviços de um negócio
  getBusinessServices(businessId: number): Observable<Service[]> {
    return this.http.get<Service[]>(
      API_ENDPOINTS.businesses.services.getBusinessService(businessId)
    );
  }

  // Método para buscar a avaliação média de um negócio
  getBusinessRating(businessId: number): Observable<Rating> {
    return this.http.get<Rating>(
      API_ENDPOINTS.rating.getBusinessRatingAvg(businessId)
    );
  }

  // Método para buscar todas as avaliações de um negócio
  getAllBusinessReviews(businessId: number): Observable<BusinessReviewsResponse> {
    return this.http.get<BusinessReviewsResponse>(
      API_ENDPOINTS.rating.getBusinessReviews(businessId)
    );
  }
}
