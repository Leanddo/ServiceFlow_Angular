import { Component } from '@angular/core';
import {
  BusinessService,
  BusinessWithExtras,
} from '../../../services/business.service';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ServiceCardComponent } from '../service-card/service-card.component';

@Component({
  selector: 'app-businesses-list',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, ServiceCardComponent],
  templateUrl: './businesses-list.component.html',
  styleUrl: './businesses-list.component.scss',
})
export class BusinessesListComponent {
  businessCards: BusinessWithExtras[] = [];
  loading = true;

  // Variáveis para filtro
  filterName: string = '';
  filterBusinessType: string = '';
  dadosCarregados: number = 0;
  selectedFilter: string = 'highestRating';

  currentPage: number = 1;
  itemsPerPage: number = 5;

  Math = Math;

  constructor(
    private businessService: BusinessService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    // Inscreve-se nos parâmetros da rota para aplicar os filtros
    this.route.queryParams.subscribe((params) => {
      this.filterName = params['name'] || '';
      this.filterBusinessType = params['business_type'] || '';
      this.loadBusinessesWithExtras();
    });
  }

  loadBusinessesWithExtras(): void {
    this.loading = true;
    this.businessService
      .getAllBusinesses({
        name: this.filterName,
        business_type: this.filterBusinessType,
      })
      .subscribe({
        next: (data) => {
          this.businessCards = data;
          console.log(this.businessCards);
          this.dadosCarregados = this.businessCards.length;
          this.loading = false;

          // Aplica o filtro após carregar os dados
          this.applyFilter();
        },
        error: (err) => {
          console.error('Erro ao carregar os negócios:', err);
          this.loading = false;
        },
      });
  }

  getStarStyle(rating: number, index: number): { [key: string]: string } {
    const fullStars = Math.floor(rating);
    const decimalPart = rating - fullStars;

    if (index < fullStars) {
      return { '--fill': '100%' };
    } else if (index === fullStars && decimalPart > 0) {
      return { '--fill': `${decimalPart * 100}%` };
    } else {
      return { '--fill': '0%' };
    }
  }

  getTotalBusinesses(): number {
    return this.dadosCarregados;
  }

  applyFilter(): void {
    if (this.selectedFilter === 'highestRating') {
      this.businessCards.sort((a, b) => {
        const ratingA = a.rating?.average_rating ?? -1; // Define -1 para negócios sem avaliação
        const ratingB = b.rating?.average_rating ?? -1;

        if (ratingB === ratingA) {
          const reviewsA = a.rating?.total_reviews ?? 0; // Define 0 para negócios sem avaliações
          const reviewsB = b.rating?.total_reviews ?? 0;
          return reviewsB - reviewsA; // Ordena do maior para o menor número de avaliações
        }

        return ratingB - ratingA; // Ordena do maior para o menor
      });
    } else if (this.selectedFilter === 'lowestRating') {
      this.businessCards.sort((a, b) => {
        const ratingA = a.rating?.average_rating ?? Infinity; // Define Infinity para negócios sem avaliação
        const ratingB = b.rating?.average_rating ?? Infinity;
        return ratingA - ratingB; // Ordena do menor para o maior
      });
    } else if (this.selectedFilter === 'mostServices') {
      this.businessCards.sort(
        (a, b) => (b.services?.length || 0) - (a.services?.length || 0)
      );
    } else if (this.selectedFilter === 'leastServices') {
      this.businessCards.sort(
        (a, b) => (a.services?.length || 0) - (b.services?.length || 0)
      );
    }
  }

  getPaginatedBusinesses(): BusinessWithExtras[] {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    return this.businessCards.slice(startIndex, endIndex);
  }

  getPages(): number[] {
    const totalPages = Math.ceil(this.businessCards.length / this.itemsPerPage);
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  previousPage(): void {
    if (
      this.currentPage >
      Math.ceil(this.businessCards.length / this.itemsPerPage)
    ) {
      this.currentPage--;
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  nextPage(): void {
    if (
      this.currentPage <
      Math.ceil(this.businessCards.length / this.itemsPerPage)
    ) {
      this.currentPage++;
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  goToPage(page: number): void {
    this.currentPage = page;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}
