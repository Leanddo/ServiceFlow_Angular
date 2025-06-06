import { Injectable } from '@angular/core';
import { HttpClient, HttpRequest } from '@angular/common/http';
import { Observable, forkJoin, of } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import { API_ENDPOINTS } from '../../config/api';
import {
  Business,
  Service,
  Rating,
  Photo,
  Professionals,
  BusinessReviewsResponse,
  ProfessionalInvite,
} from '../model/business.model';

// Interface que combina os dados do negócio com informações adicionais
export interface BusinessWithExtras {
  business: Business; // Dados do negócio
  services: Service[]; // Lista de serviços do negócio
  rating: Rating; // Avaliação média do negócio
  photos?: Photo[]; // Fotos do negócio (opcional)
  professionals?: Professionals[]; // Lista de profissionais do negócio (opcional)
}

@Injectable({
  providedIn: 'root',
})
export class BusinessService {
  constructor(private http: HttpClient) {}

  // Método para buscar todos os negócios com filtros opcionais
  getAllBusinesses(filters?: {
    business_type?: string;
    name?: string;
  }): Observable<BusinessWithExtras[]> {
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
    return this.http.get<Business[]>(url, { withCredentials: true }).pipe(
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
              catchError(
                () => of({ average_rating: 0, total_reviews: 0 } as Rating) // Retorna uma avaliação padrão em caso de erro
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
      .get<Business>(API_ENDPOINTS.businesses.getById(businessId), {
        withCredentials: true,
      })
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
              catchError(
                () => of({ average_rating: 0, total_reviews: 0 } as Rating) // Retorna uma avaliação padrão em caso de erro
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
  getPublicBusinessProfessionals(
    businessId: number
  ): Observable<Professionals[]> {
    return this.http.get<Professionals[]>(
      API_ENDPOINTS.businesses.professionals.getPublicBusinessProfessionalsById(
        businessId
      ),
      { withCredentials: true }
    );
  }

  // Método para buscar as fotos de um negócio
  getBusinessPhotos(businessId: number): Observable<Photo[]> {
    return this.http.get<Photo[]>(
      API_ENDPOINTS.businesses.photos.getBusinessPhotos(businessId),
      { withCredentials: true }
    );
  }

  uploadBusinessImages(businessId: number, file: File): Observable<any> {
    const formData = new FormData();
    // Lembre-se: o nome do campo 'foto' deve ser o mesmo que o backend (Multer) espera.
    formData.append('fotos', file, file.name);

    // 1. Crie um objeto HttpRequest para ter controle total
    const req = new HttpRequest(
      'POST',
      API_ENDPOINTS.businesses.photos.uploadBusinessPhotos(businessId),
      formData,
      {
        reportProgress: true, // <-- A MÁGICA ACONTECE AQUI! Habilita os eventos de progresso.
        withCredentials: true,
      }
    );

    // 2. Use http.request(req) em vez de http.post()
    return this.http.request(req);
  }

  updateSinglePhoto(businessId: number, photo: File): Observable<any> {
    const formData = new FormData();
    formData.append('foto', photo);

    return this.http.put(
      API_ENDPOINTS.businesses.updateSinglePhoto(businessId),
      formData,
      { withCredentials: true }
    );
  }

  // Método para buscar os serviços de um negócio
  getBusinessServices(businessId: number): Observable<Service[]> {
    return this.http.get<Service[]>(
      API_ENDPOINTS.businesses.services.getBusinessService(businessId),
      { withCredentials: true }
    );
  }

  createService(businessId: number, services: Service): Observable<any> {
    return this.http.post<Service>(
      API_ENDPOINTS.businesses.services.createBusinessService(businessId),
      services,
      { withCredentials: true }
    );
  }

  // Método para buscar a avaliação média de um negócio
  getBusinessRating(businessId: number): Observable<Rating> {
    return this.http.get<Rating>(
      API_ENDPOINTS.rating.getBusinessRatingAvg(businessId),
      { withCredentials: true }
    );
  }

  // Método para buscar todas as avaliações de um negócio
  getAllBusinessReviews(
    businessId: number
  ): Observable<BusinessReviewsResponse> {
    return this.http.get<BusinessReviewsResponse>(
      API_ENDPOINTS.rating.getBusinessReviews(businessId),
      { withCredentials: true }
    );
  }

  // Método para criar um novo negócio
  createBusiness(data: Business): Observable<any> {
    return this.http.post(API_ENDPOINTS.businesses.create, data, {
      withCredentials: true,
    });
  }

  // Método para atualizar um negócio existente
  updateBusiness(id: number, data: any): Observable<any> {
    return this.http.put(API_ENDPOINTS.businesses.update(id), data, {
      withCredentials: true,
    });
  }

  // Método para buscar os profissionais privados de um negócio
  getPrivateBusinessProfessionals(
    businessId: number
  ): Observable<Professionals[]> {
    return this.http.get<Professionals[]>(
      API_ENDPOINTS.businesses.professionals.getPrivateBusinessProfessionalsById(
        businessId
      ),
      { withCredentials: true }
    );
  }

  inviteProfessional(
    businessId: number,
    inviteData: ProfessionalInvite
  ): Observable<any> {
    return this.http.post(
      API_ENDPOINTS.businesses.professionals.inviteProfessionals(businessId),
      inviteData,
      { withCredentials: true }
    );
  }

  isOwner(businessId: number): Observable<boolean> {
    return this.http.get<boolean>(
      API_ENDPOINTS.businesses.isOwnner(businessId),
      { withCredentials: true }
    );
  }
}
