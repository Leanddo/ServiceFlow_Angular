import { Component, ElementRef, ViewChild } from '@angular/core';
import {
  BusinessService,
  BusinessWithExtras,
} from '../../../services/business.service';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ServiceCardComponent } from '../service-card/service-card.component';
import { HttpClient } from '@angular/common/http';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { BusinessReviewsResponse } from '../../../model/business.model';
import { catchError, of } from 'rxjs';

@Component({
  selector: 'app-business',
  standalone: true,
  imports: [CommonModule, FormsModule, ServiceCardComponent],
  templateUrl: './business.component.html',
  styleUrl: './business.component.scss',
})
export class BusinessComponent {
  // Propriedades do componente
  business!: BusinessWithExtras['business']; // Dados do negócio
  services: BusinessWithExtras['services'] = []; // Lista de serviços do negócio
  rating!: BusinessWithExtras['rating']; // Avaliação média do negócio
  reviewsResponse: BusinessReviewsResponse = {
    business_name: '',
    total_reviews: 0,
    reviews: [],
  }; // Resposta das avaliações do negócio
  professionals!: BusinessWithExtras['professionals']; // Lista de profissionais do negócio
  businessPhotos: BusinessWithExtras['photos'] = []; // Fotos do negócio
  loading = true; // Indica se os dados estão sendo carregados
  lat!: number; // Latitude do endereço do negócio
  lon!: number; // Longitude do endereço do negócio
  mapUrl!: SafeResourceUrl; // URL segura para o mapa do endereço

  constructor(
    private businessService: BusinessService, // Serviço para buscar dados do negócio
    private route: ActivatedRoute, // Serviço para acessar parâmetros da rota
    private http: HttpClient, // Serviço HTTP para requisições externas
    private sanitizer: DomSanitizer // Serviço para sanitizar URLs
  ) {}

  ngOnInit(): void {
    // Obtém o ID do negócio a partir da rota
    const businessId = this.route.snapshot.paramMap.get('id');
    if (businessId) {
      this.loadBusinessDetails(+businessId); // Carrega os detalhes do negócio
      this.loadBusinessReviews(+businessId); // Carrega as avaliações do negócio
    }
  }

  // Carrega os detalhes do negócio
  loadBusinessDetails(businessId: number): void {
    this.loading = true; // Indica que os dados estão sendo carregados

    this.businessService
      .getBusinessById(businessId) // Faz a requisição para buscar os detalhes do negócio
      .subscribe((businessData) => {
        if (businessData) {
          this.business = businessData.business; // Define os dados do negócio
          this.services = businessData.services; // Define os serviços do negócio
          this.rating = businessData.rating; // Define a avaliação média
          this.professionals = businessData.professionals; // Define os profissionais
          this.businessPhotos = businessData.photos || []; // Define as fotos do negócio

          if (this.business?.business_address) {
            this.getCoordinates(); // Obtém as coordenadas do endereço
          }
        }

        this.loading = false; // Indica que os dados foram carregados
      });
  }

  // Carrega as avaliações do negócio
  loadBusinessReviews(businessId: number): void {
    this.businessService
      .getAllBusinessReviews(businessId) // Faz a requisição para buscar as avaliações
      .pipe(
        catchError((error) => {
          console.error('Erro ao carregar avaliações:', error); // Loga o erro no console
          return of({
            business_name: '',
            total_reviews: 0,
            reviews: [],
          }); // Retorna um objeto vazio em caso de erro
        })
      )
      .subscribe((response) => {
        this.reviewsResponse = response; // Define a resposta das avaliações
        console.log(this.reviewsResponse); // Loga as avaliações no console

        this.sortReviewsByOrder('highest'); // Aplica o filtro padrão (Maior Avaliação)
      });
  }

  // Obtém as coordenadas do endereço do negócio
  getCoordinates() {
    if (!this.business?.business_address) {
      console.error('Endereço não está definido.'); // Loga um erro se o endereço não estiver definido
      return;
    }

    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
      this.business.business_address
    )}`; // Monta a URL para buscar as coordenadas

    this.http.get<any[]>(url).subscribe((results) => {
      if (results.length > 0) {
        this.lat = parseFloat(results[0].lat); // Define a latitude
        this.lon = parseFloat(results[0].lon); // Define a longitude
        const unsafeUrl = `https://www.google.com/maps?q=${this.lat},${this.lon}&z=15&output=embed`; // Monta a URL do mapa
        this.mapUrl = this.sanitizer.bypassSecurityTrustResourceUrl(unsafeUrl); // Sanitiza a URL do mapa
      } else {
        console.log('Endereço não encontrado'); // Loga um erro se o endereço não for encontrado
      }
    });
  }

  // Define o estilo das estrelas com base na avaliação média
  getStarStyle(
    averageRating: number,
    index: number
  ): { [key: string]: string } {
    const fillPercentage =
      Math.min(Math.max(averageRating - index, 0), 1) * 100; // Calcula a porcentagem de preenchimento da estrela
    return {
      '--fill': `${fillPercentage}%`, // Retorna o estilo CSS para a estrela
    };
  }

  // Ordena as avaliações com base na ordem selecionada
  sortReviewsByOrder(order: string): void {
    if (order === 'highest') {
      this.reviewsResponse.reviews.sort((a, b) => b.review_rating - a.review_rating); // Ordena por maior avaliação
    } else if (order === 'lowest') {
      this.reviewsResponse.reviews.sort((a, b) => a.review_rating - b.review_rating); // Ordena por menor avaliação
    } else if (order === 'newest') {
      this.reviewsResponse.reviews.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()); // Ordena por mais recente
    } else if (order === 'oldest') {
      this.reviewsResponse.reviews.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()); // Ordena por mais antigo
    }
  }

  // Lida com a mudança de ordem no select
  sortReviews(event: Event): void {
    const selectElement = event.target as HTMLSelectElement; // Garante que o EventTarget é um HTMLSelectElement
    const order = selectElement.value; // Obtém o valor selecionado
    this.sortReviewsByOrder(order); // Reutiliza a lógica de ordenação
  }

  @ViewChild('slider', { static: false }) slider!: ElementRef; // Referência ao elemento do slider

  // Faz o scroll do slider
  scrollSlider(direction: number): void {
    const slider = this.slider.nativeElement; // Obtém o elemento do slider
    const scrollAmount = slider.offsetWidth; // Define a quantidade de scroll com base na largura do slider
    slider.scrollBy({ left: direction * scrollAmount, behavior: 'smooth' }); // Faz o scroll suave
  }
}
