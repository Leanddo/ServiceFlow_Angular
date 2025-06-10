import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { forkJoin, of } from 'rxjs';
import { switchMap, finalize } from 'rxjs/operators';
import { CommonModule } from '@angular/common';
import {
  BusinessService,
  BusinessWithExtras,
} from '../../../services/business.service';
import { Photo } from '../../../model/business.model';

@Component({
  selector: 'app-dashboard-business',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './dashboard-business.component.html',
  styleUrl: './dashboard-business.component.scss',
})
export class DashboardBusinessComponent implements OnInit {
  businessTypes: string[] = [
    'Barbershop',
    'Workshop',
    'Clinic',
    'Other',
    'Restaurant',
    'Gym',
    'Hairdresser',
    'Pet Store',
    'Consulting Room',
    'Pharmacy',
    'Photography Studio',
    'Cafeteria',
    'Spa',
    'School',
    'Cleaning Services',
    'Transportation',
    'Hotel',
    'Beauty Salon',
    'Laundry',
    'Kiosk',
    'Event Venue',
    'Bar',
    'Fast Food Restaurant',
    'Car Repair Shop',
    'Consultancy',
    'Design Services',
    'Tattoo Studio',
    'Massage Therapy',
    'Nail Salon',
    'Travel Agency',
  ];

  businessId!: number;
  businessForm!: FormGroup;
  photos: Photo[] = [];
  mainPhotoUrl: string | null = null;

  // Estados da UI
  isLoading = true;
  isSubmitting = false;
  isUploading = false;
  isMainPhotoUploading = false;

  // Mensagens de feedback
  feedbackMessage: string | null = null;
  isFeedbackError = false;

  // Ficheiros para upload da galeria
  filesToUpload: { file: File; previewUrl: string }[] = [];

  // Guarda o ficheiro e a pré-visualização da foto principal antes do upload
  mainPhotoToUpload: { file: File; previewUrl: string } | null = null;

  // Variáveis para o Modal de Confirmação
  isDeleteModalVisible = false;
  photoToDeleteId: number | null = null;

  constructor(
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private businessService: BusinessService
  ) {}

  // --- Ciclo de Vida do Componente ---
  ngOnInit(): void {
    this.initializeForm();
    this.loadDataFromRoute();
  }

  // --- Lógica de Carregamento de Dados ---
  private loadDataFromRoute(): void {
    this.route.paramMap
      .pipe(
        switchMap((params) => {
          this.isLoading = true;
          const id = params.get('businessId');
          if (!id) {
            this.showFeedback(
              'ID do negócio não foi encontrado na rota.',
              true
            );
            return of(null);
          }
          this.businessId = +id;
          return this.businessService.getBusinessById(this.businessId);
        }),
        finalize(() => (this.isLoading = false))
      )
      .subscribe({
        next: (response: BusinessWithExtras | null) => {
          if (!response) return;
          this.businessForm.patchValue(response.business);
          this.photos = response.photos || [];
          this.mainPhotoUrl = response.business.main_photo_url || null;
        },
        error: (err) => {
          this.showFeedback(
            'Ocorreu um erro fatal ao carregar a página.',
            true
          );
          console.error('Erro na subscrição principal do ngOnInit:', err);
        },
      });
  }

  // --- Métodos do Formulário ---
  initializeForm(): void {
    this.businessForm = this.fb.group({
      business_name: ['', Validators.required],
      business_address: ['', Validators.required],
      business_type: [null, Validators.required],
      business_phone: ['', Validators.required],
      business_email: ['', [Validators.required, Validators.email]],
      description: [''],
    });
  }

  onSubmit(): void {
    if (this.businessForm.invalid) {
      this.showFeedback(
        'Por favor, preencha todos os campos obrigatórios.',
        true
      );
      return;
    }
    this.isSubmitting = true;
    this.feedbackMessage = null;
    this.businessService
      .updateBusiness(this.businessId, this.businessForm.value)
      .pipe(finalize(() => (this.isSubmitting = false)))
      .subscribe({
        next: () =>
          this.showFeedback(
            'Informações do negócio atualizadas com sucesso!',
            false
          ),
        error: (err) => {
          this.showFeedback(
            'Ocorreu um erro ao atualizar. Tente novamente.',
            true
          );
          console.error(err);
        },
      });
  }

  // --- Métodos de Gestão de Fotos ---

  // Cria a pré-visualização da foto principal
  onMainPhotoSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e: any) => {
      this.mainPhotoToUpload = { file: file, previewUrl: e.target.result };
    };
    reader.readAsDataURL(file);
    input.value = '';
  }

  // Cancela a pré-visualização
  cancelMainPhotoUpload(): void {
    this.mainPhotoToUpload = null;
  }

  // Confirma e inicia o upload da foto principal
  confirmMainPhotoUpload(): void {
    if (!this.mainPhotoToUpload) return;
    this.isMainPhotoUploading = true;
    this.feedbackMessage = null;
    this.businessService
      .updateSinglePhoto(this.businessId, this.mainPhotoToUpload.file)
      .pipe(finalize(() => (this.isMainPhotoUploading = false)))
      .subscribe({
        next: (response) => {
          this.mainPhotoUrl = response.main_photo_url;
          this.mainPhotoToUpload = null;
          this.showFeedback('Foto de destaque atualizada com sucesso!', false);
          window.location.reload();
        },
        error: (err) => {
          this.showFeedback('Erro ao atualizar a foto de destaque.', true);
          console.error(err);
        },
      });
  }

  // Define uma foto da galeria como principal
  setMainPhotoFromGallery(photoId: number): void {
    const photoToSet = this.photos.find((p) => p.photo_id === photoId);
    if (!photoToSet || photoToSet.photo_url === this.mainPhotoUrl) return;

    this.mainPhotoUrl = photoToSet.photo_url;
    // TODO: Chamar o serviço de backend para persistir a mudança
    this.showFeedback(`Foto definida como destaque.`, false);
  }

  // Seleciona ficheiros para a galeria
  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (!input.files) return;
    this.filesToUpload = [];
    for (let i = 0; i < input.files.length; i++) {
      const file = input.files[i];
      const reader = new FileReader();
      reader.onload = (e: any) =>
        this.filesToUpload.push({ file, previewUrl: e.target.result });
      reader.readAsDataURL(file);
    }
  }

  // Remove da pré-visualização da galeria
  removeFileFromPreview(index: number): void {
    this.filesToUpload.splice(index, 1);
  }

  // Faz upload dos ficheiros para a galeria
  uploadFiles(): void {
    if (this.filesToUpload.length === 0) return;
    this.isUploading = true;
    this.feedbackMessage = null;
    const uploadObservables = this.filesToUpload.map((fileObj) =>
      this.businessService.uploadBusinessImages(this.businessId, fileObj.file)
    );
    forkJoin(uploadObservables)
      .pipe(finalize(() => (this.isUploading = false)))
      .subscribe({
        next: () => {
          this.showFeedback('Fotos carregadas com sucesso!', false);
          this.filesToUpload = [];
          this.reloadPhotos();
        },
        error: (err) => {
          this.showFeedback('Erro ao carregar uma ou mais fotos.', true);
          console.error(err);
        },
      });
  }

  // Abre o modal de confirmação para apagar foto
  deletePhoto(photoId: number): void {
    this.photoToDeleteId = photoId;
    this.isDeleteModalVisible = true;
  }

  // Confirma a exclusão da foto (chamado pelo modal)
  confirmDelete(): void {
    if (!this.photoToDeleteId) return;
    const idToDelete = this.photoToDeleteId;

    this.businessService
      .deleteBusinessPhoto(this.businessId, idToDelete)
      .subscribe({
        next: () => {
          this.showFeedback('Foto apagada com sucesso.', false);
          const deletedPhoto = this.photos.find(
            (p) => p.photo_id === idToDelete
          );
          if (deletedPhoto && deletedPhoto.photo_url === this.mainPhotoUrl) {
            this.mainPhotoUrl = null;
          }
          this.photos = this.photos.filter((p) => p.photo_id !== idToDelete);
          this.closeDeleteModal();
        },
        error: (err) => {
          this.showFeedback('Erro ao apagar a foto.', true);
          console.error(err);
          this.closeDeleteModal();
        },
      });
  }

  // Fecha o modal
  closeDeleteModal(): void {
    this.isDeleteModalVisible = false;
    this.photoToDeleteId = null;
  }

  // --- Métodos Privados de Apoio ---
  private reloadPhotos(): void {
    this.businessService
      .getBusinessPhotos(this.businessId)
      .subscribe((photos) => {
        this.photos = photos;
      });
  }

  private showFeedback(message: string, isError: boolean): void {
    this.feedbackMessage = message;
    this.isFeedbackError = isError;
    setTimeout(() => (this.feedbackMessage = null), 5000);
  }
}
