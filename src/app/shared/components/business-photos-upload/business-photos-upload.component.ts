import { HttpEventType, HttpResponse, HttpEvent } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BusinessService } from '../../../services/business.service';
import { Business, Photo } from '../../../model/business.model';
import { finalize } from 'rxjs/operators';

interface FilePreview {
  file: File;
  previewUrl: string | ArrayBuffer | null;
  progress: number;
  isUploading: boolean;
  isUploaded: boolean;
  error: string | null;
}

@Component({
  selector: 'app-business-photos-upload',
  templateUrl: './business-photos-upload.component.html',
  styleUrls: ['./business-photos-upload.component.scss']
})
export class BusinessPhotosUploadComponent implements OnInit {
  businessId!: number;
  businessName: string = '';

  mainPhotoUrl: string | null = null;
  settingMainPhotoId: number | null = null;

  selectedFilePreviews: FilePreview[] = [];
  readonly maxFiles = 5;
  readonly minRequiredPhotos = 2;
  readonly maxFileSizeMB = 20;

  isLoadingExistingPhotos = false;
  isUploadingAll = false;

  errorMessage: string | null = null;
  successMessage: string | null = null;
  
  uploadedPhotos: Photo[] = [];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private businessService: BusinessService
  ) {}

  get queuedFilesCount(): number {
    if (!this.selectedFilePreviews) return 0;
    return this.selectedFilePreviews.filter(p => !p.isUploaded).length;
  }

  get isFileInputDisabled(): boolean {
    const totalPhotos = this.uploadedPhotos.length + this.queuedFilesCount;
    return this.isUploadingAll || totalPhotos >= this.maxFiles;
  }

  get fileInputLabelText(): string {
    const slotsUsed = this.uploadedPhotos.length + this.queuedFilesCount;
    return `Selecionar Fotos (${slotsUsed} / ${this.maxFiles} total)`;
  }

  get filesReadyForUploadCount(): number {
    if (!this.selectedFilePreviews) return 0;
    return this.selectedFilePreviews.filter(p => !p.isUploaded && !p.isUploading && !p.error).length;
  }

  get canUploadAnyFiles(): boolean {
    return this.filesReadyForUploadCount > 0;
  }

  get uploadButtonText(): string {
    if (this.isUploadingAll) {
      return 'Enviando...';
    }
    return `Enviar ${this.filesReadyForUploadCount} Foto(s) Selecionada(s)`;
  }

  get canProceedToNextStep(): boolean {
    const noPendingActions = this.selectedFilePreviews.every(p => p.isUploaded || p.error);
    return this.uploadedPhotos.length >= this.minRequiredPhotos && noPendingActions;
  }

  isCurrentMainPhoto(photo: Photo): boolean {
    if (!this.mainPhotoUrl || !photo.photo_url) return false;
    try {
      const mainUrlPath = new URL(this.mainPhotoUrl).pathname;
      const photoUrlPath = new URL(photo.photo_url).pathname;
      return mainUrlPath === photoUrlPath;
    } catch (e) {
      return this.mainPhotoUrl === photo.photo_url;
    }
  }

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('businessId');
    if (idParam) {
      this.businessId = +idParam;
      this.loadBusinessDetails();
      this.loadUploadedPhotos();
    } else {
      this.errorMessage = "ID do negócio não encontrado na rota.";
    }
  }

  loadBusinessDetails(): void {
    if (!this.businessId) return;
    this.businessService.getBusinessById(this.businessId).subscribe({
      next: (businessData) => {
        this.businessName = businessData?.business.business_name || 'Nome Indisponível';
        this.mainPhotoUrl = businessData?.business.main_photo_url || null;
      },
      error: (err) => console.error("Erro ao carregar detalhes do negócio:", err)
    });
  }

  loadUploadedPhotos(): void {
    if (!this.businessId) return;
    this.isLoadingExistingPhotos = true;
    this.businessService.getBusinessPhotos(this.businessId).subscribe({
      next: (photos) => {
        this.uploadedPhotos = photos || [];
        this.isLoadingExistingPhotos = false;
        if (!this.mainPhotoUrl && this.uploadedPhotos.length > 0) {
           this.mainPhotoUrl = this.uploadedPhotos[0].photo_url;
        }
      },
      error: (err) => {
        this.errorMessage = "Não foi possível carregar as fotos existentes.";
        this.isLoadingExistingPhotos = false;
      }
    });
  }

  onFilesSelected(event: Event): void {
    this.clearGlobalMessages();
    const inputElement = event.target as HTMLInputElement;
    if (!inputElement.files) return;

    const files = Array.from(inputElement.files);
    const currentTotalPhotos = this.uploadedPhotos.length + this.selectedFilePreviews.length;
    const remainingSlots = this.maxFiles - currentTotalPhotos;

    if (files.length > remainingSlots) {
      this.errorMessage = `Pode adicionar no máximo mais ${remainingSlots} fotos.`;
      inputElement.value = '';
      return;
    }

    for (const file of files) {
      const filePreview: FilePreview = { file, previewUrl: null, progress: 0, isUploading: false, isUploaded: false, error: null };
      this.selectedFilePreviews.push(filePreview);
      const reader = new FileReader();
      reader.onload = (e) => filePreview.previewUrl = e.target?.result || null;
      reader.readAsDataURL(file);
    }
    inputElement.value = '';
  }

  removeSelectedFile(index: number): void {
    if (this.selectedFilePreviews[index] && !this.selectedFilePreviews[index].isUploading) {
        this.selectedFilePreviews.splice(index, 1);
    }
  }

  uploadAllSelectedFiles(): void {
    this.clearGlobalMessages();
    if (this.filesReadyForUploadCount === 0) return;
    
    this.isUploadingAll = true;
    const filesToUpload = this.selectedFilePreviews.filter(p => !p.isUploaded && !p.isUploading && !p.error);
    const uploadPromises = filesToUpload.map(filePreview => this.uploadFile(filePreview));
    
    Promise.allSettled(uploadPromises).finally(() => {
      this.isUploadingAll = false;
      this.loadUploadedPhotos();
    });
  }

  private uploadFile(filePreview: FilePreview): Promise<void> {
    return new Promise((resolve, reject) => {
      filePreview.isUploading = true;
      filePreview.error = null;

      this.businessService.uploadBusinessImages(this.businessId, filePreview.file).subscribe({
        next: (event: HttpEvent<any>) => {
          if (event.type === HttpEventType.UploadProgress && event.total) {
            filePreview.progress = Math.round(100 * event.loaded / event.total);
          } else if (event instanceof HttpResponse) {
            filePreview.isUploaded = true;
            resolve();
          }
        },
        error: (err) => {
          filePreview.error = err?.error?.message || 'Falha no upload.';
          reject(err);
        },
        complete: () => filePreview.isUploading = false
      });
    });
  }

  async onSetMainPhoto(photo: Photo): Promise<void> {
    this.clearGlobalMessages();
    if (this.isCurrentMainPhoto(photo) || this.settingMainPhotoId) {
      return;
    }

    this.settingMainPhotoId = photo.photo_id;

    try {
      // Passo 1: Baixar a imagem da URL
      const response = await fetch(photo.photo_url);
      const blob = await response.blob();
      
      // Passo 2: Criar um nome de arquivo e converter o Blob para File
      const filename = photo.photo_url.split('/').pop() || 'main_photo.jpg';
      const fileToUpload = new File([blob], filename, { type: blob.type });

      // Passo 3: Chamar o serviço obrigatório com o novo File
      this.businessService.updateSinglePhoto(this.businessId, fileToUpload)
        .pipe(finalize(() => this.settingMainPhotoId = null))
        .subscribe({
          next: (res) => {
            // No sucesso, o backend deve retornar a nova URL principal.
            this.mainPhotoUrl = res?.main_photo_url || photo.photo_url;
            this.successMessage = "Foto principal atualizada com sucesso!";
          },
          error: (err) => {
            this.errorMessage = err?.error?.message || "Não foi possível atualizar a foto principal.";
          }
        });

    } catch (error) {
      console.error("Erro ao processar a foto principal:", error);
      this.errorMessage = "Falha ao baixar a imagem para defini-la como principal.";
      this.settingMainPhotoId = null;
    }
  }

  clearGlobalMessages(): void {
    this.errorMessage = null;
    this.successMessage = null;
  }

  proceedToNextStep(): void {
    if (this.filesReadyForUploadCount > 0) {
      this.errorMessage = `Por favor, envie as ${this.filesReadyForUploadCount} foto(s) selecionada(s) ou remova-as.`;
      return;
    }
    if (this.uploadedPhotos.length < this.minRequiredPhotos) {
      this.errorMessage = `É necessário enviar pelo menos ${this.minRequiredPhotos} fotos.`;
      return;
    }
    this.router.navigate(['/create-business/professionals', this.businessId]);
  }
}