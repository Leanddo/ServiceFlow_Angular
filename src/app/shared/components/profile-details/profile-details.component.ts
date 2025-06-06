import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ProfileService } from '../../../services/profile.service';
import { UserProfile } from '../../../model/user-profile.model'; // Import the UserProfile model

@Component({
  selector: 'app-profile-details',
  templateUrl: './profile-details.component.html',
  styleUrls: ['./profile-details.component.scss'],
})
export class ProfileDetailsComponent implements OnInit {
    // Para exibir os detalhes do perfil
    profileDetails: UserProfile | null = null;
    isLoadingProfile: boolean = true; // Para feedback de carregamento inicial do perfil
  
    // Para upload de imagem
    imageUrlPreview: string | ArrayBuffer | null = 'assets/default-avatar.png';
    readonly defaultAvatar: string = 'assets/default-avatar.png';
  
    selectedFile: File | null = null;
    selectedFileName: string | null = null;
    isUploading: boolean = false;
  
    // Mensagens de feedback para o HTML
    successMessage: string | null = null;
    errorMessage: string | null = null;
    validationMessage: string | null = null;
  
    @ViewChild('fileUploadInput') fileUploadInput!: ElementRef<HTMLInputElement>;
  
    constructor(private profileService: ProfileService) {}
  
    ngOnInit(): void {
      this.loadProfileDetails();
    }
  
    loadProfileDetails(): void {
      this.isLoadingProfile = true;
      this.clearMessages(); // Limpa mensagens antigas
      this.profileService.getProfileDetails().subscribe({
        next: (details: UserProfile) => {
          this.profileDetails = details;
          this.imageUrlPreview = (details && details.fotoUrl) ? details.fotoUrl : this.defaultAvatar;
          this.isLoadingProfile = false;
        },
        error: (err) => {
          console.error('Erro ao carregar detalhes do perfil:', err);
          this.errorMessage = 'Não foi possível carregar os detalhes do perfil. Tente novamente.';
          this.imageUrlPreview = this.defaultAvatar;
          this.isLoadingProfile = false;
        }
      });
    }
  
    triggerFileInput(): void {
      if (!this.isUploading) {
        this.clearMessages();
        this.fileUploadInput.nativeElement.click();
      }
    }
  
    onFileSelected(event: any): void {
      this.clearMessages();
      const file = event.target.files[0] as File;
  
      if (file) {
        const allowedTypes = ['image/png', 'image/jpeg', 'image/gif'];
        if (!allowedTypes.includes(file.type)) {
          this.validationMessage = 'Tipo de arquivo inválido. Selecione PNG, JPG ou GIF.';
          this.resetFileSelectionInput();
          return;
        }
  
        const maxSizeInBytes = 5 * 1024 * 1024; // 5MB
        if (file.size > maxSizeInBytes) {
          this.validationMessage = 'Arquivo muito grande. Máximo de 5MB permitido.';
          this.resetFileSelectionInput();
          return;
        }
  
        this.selectedFile = file;
        this.selectedFileName = file.name;
        this.successMessage = null;
  
        const reader = new FileReader();
        reader.onload = e => (this.imageUrlPreview = e.target?.result || this.defaultAvatar);
        reader.readAsDataURL(file);
      } else {
        this.resetFileSelectionInput();
      }
    }
  
    onUploadImage(): void { // Renomeado de onUpload para onUploadImage para clareza
      if (!this.selectedFile) {
        this.validationMessage = 'Por favor, selecione uma imagem primeiro.';
        return;
      }
  
      this.clearMessages();
      this.isUploading = true;
  
      this.profileService.uploadProfileImage(this.selectedFile).subscribe({
        next: (response) => {
          this.successMessage = 'Foto de perfil atualizada com sucesso! A página será recarregada.';
          // this.selectedFileName = null; // Opcional: limpar nome do arquivo
          // this.selectedFile = null;    // Opcional: limpar arquivo
          
          // Recarrega a página para refletir as mudanças globalmente
          // Adiar um pouco o reload para o usuário ver a mensagem de sucesso
          setTimeout(() => {
              window.location.reload();
          }, 1500); // Recarrega após 1.5 segundos
        },
        error: (error) => {
          console.error('Erro no upload:', error);
          this.errorMessage = error?.error?.message || error?.message || 'Ocorreu um erro ao atualizar a foto.';
          // Não reverter o preview aqui, pois o usuário pode querer tentar de novo com o mesmo arquivo
        },
        complete: () => {
          this.isUploading = false;
        }
      });
    }
  
    cancelImageSelection(): void {
      this.clearMessages();
      this.selectedFile = null;
      this.selectedFileName = null;
      // Reverte para a imagem do perfil atual (se carregado) ou padrão
      this.imageUrlPreview = (this.profileDetails && this.profileDetails.fotoUrl) ? this.profileDetails.fotoUrl : this.defaultAvatar;
      this.resetFileSelectionInput();
    }
  
    private clearMessages(): void {
      this.successMessage = null;
      this.errorMessage = null;
      this.validationMessage = null;
    }
  
    private resetFileSelectionInput(): void {
      if (this.fileUploadInput && this.fileUploadInput.nativeElement) {
        this.fileUploadInput.nativeElement.value = "";
      }
    } 
}
