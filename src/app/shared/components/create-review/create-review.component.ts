import { Component, OnDestroy, OnInit } from '@angular/core';
import { CreateReview, Review, Service } from '../../../model/business.model';
import { finalize, Subscription } from 'rxjs';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { RatingService } from '../../../services/rating.service';
import { CommonModule } from '@angular/common';
import { BusinessService } from '../../../services/business.service';

@Component({
  selector: 'app-create-review',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './create-review.component.html',
  styleUrl: './create-review.component.scss'
})
export class CreateReviewComponent implements OnInit, OnDestroy{
  reviewForm!: FormGroup;
  businessId!: number;
  serviceId!: number;
  isLoading = true;
  errorMessage: string | null = null;
  serviceToReview: Service | null = null;

  // --- UI Control Properties ---
  submissionSuccess = false; 
  hoveredRating = 0;
  finalRating = 0;
  stars = [1, 2, 3, 4, 5];

  private routeSub!: Subscription;

  constructor(
    private fb: FormBuilder,
    private ratingService: RatingService,
    private businessService: BusinessService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    // 1. Get IDs from route and trigger data loading
    this.routeSub = this.route.paramMap.subscribe(params => {
      const businessIdParam = params.get('business_id');
      const serviceIdParam = params.get('service_id');

      if (businessIdParam && serviceIdParam) {
        this.businessId = +businessIdParam;
        this.serviceId = +serviceIdParam;
        this.loadServiceDetails();
      } else {
        this.errorMessage = "ID do negócio ou do serviço não encontrado no URL.";
        this.isLoading = false;
        console.error('IDs em falta nos parâmetros da rota.');
      }
    });

    // 2. Initialize the reactive form
    this.reviewForm = this.fb.group({
      review_title: ['', [Validators.required, Validators.maxLength(100)]],
      review_body: ['', [Validators.required, Validators.minLength(10)]],
      review_rating: [null, [Validators.required, Validators.min(1), Validators.max(5)]],
    });
  }

  // --- Data Loading Method ---
  loadServiceDetails(): void {
    this.isLoading = true;
    this.errorMessage = null;

    this.businessService.getBusinessServicesById(this.businessId, this.serviceId).pipe(
      finalize(() => this.isLoading = false)
    ).subscribe({
      next: (service: Service) => {
        this.serviceToReview = service;
      },
      error: (err) => {
        console.error('Falha ao carregar os detalhes do serviço:', err);
        if (err.status === 404) {
          this.errorMessage = "O serviço que está a tentar avaliar não foi encontrado.";
        } else {
          this.errorMessage = "Ocorreu um erro ao carregar as informações do serviço.";
        }
      }
    });
  }

  // --- Template Helper ---
  getBackgroundImage(): string {
    const fallbackImage = 'url("ServiceFlow_Services.png")'; 
    if (this.serviceToReview?.service_fotoUrl) {
      return `url('${this.serviceToReview.service_fotoUrl}')`;
    }
    return fallbackImage;
  }

  // --- Form Getters ---
  get title() { return this.reviewForm.get('review_title'); }
  get body() { return this.reviewForm.get('review_body'); }
  get rating() { return this.reviewForm.get('review_rating'); }

  // --- Star Rating Interaction Methods ---
  setRating(rating: number): void {
    this.finalRating = rating;
    this.reviewForm.get('review_rating')?.setValue(rating);
    this.reviewForm.get('review_rating')?.markAsTouched();
  }
  setHoverRating(rating: number): void { this.hoveredRating = rating; }
  resetHoverRating(): void { this.hoveredRating = 0; }

  // --- Form Submission ---
  onSubmit(): void {
    if (this.reviewForm.invalid || !this.serviceId) {
      this.reviewForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;
    this.errorMessage = null;
    const reviewPayload: CreateReview = this.reviewForm.value;

    this.ratingService.createReview(this.serviceId, reviewPayload).pipe(
      finalize(() => this.isLoading = false)
    ).subscribe({
      next: (response) => {
        console.log('Avaliação criada com sucesso!', response);
        this.submissionSuccess = true; // Show the success message

        // Redirect after a delay so the user can see the message
        setTimeout(() => {
          this.router.navigate(['/business', this.businessId]);
        }, 3500);
      },
      error: (err) => {
        console.error('Falha ao criar avaliação:', err);
        this.errorMessage = 'Ocorreu um erro ao submeter a sua avaliação. Por favor, tente novamente.';
      }
    });
  }

  ngOnDestroy(): void {
    if (this.routeSub) {
      this.routeSub.unsubscribe();
    }
  }
}
