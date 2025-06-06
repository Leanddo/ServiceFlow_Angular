import { Component } from '@angular/core';
import { ProfileService } from '../../../services/profile.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-delete-account',
  templateUrl: './delete-account.component.html',
  styleUrls: ['./delete-account.component.scss'],
})
export class DeleteAccountComponent {
  showConfirmationDialog: boolean = false;
  isDeleting: boolean = false;

  successMessage: string | null = null;
  errorMessage: string | null = null;

  readonly requiredConfirmationWord: string = 'EXCLUIR';
  confirmationInput: string = '';

  constructor(private profileService: ProfileService, private router: Router) {}

  askForConfirmation(): void {
    this.clearMessages();
    this.confirmationInput = '';
    this.showConfirmationDialog = true;
  }

  cancelDeletion(): void {
    this.showConfirmationDialog = false;
    this.confirmationInput = '';
    this.isDeleting = false;
  }

  confirmDeleteAccount(): void {
    if (!this.isDeletionConfirmedByInput()) {
        this.errorMessage = `Por favor, digite "${this.requiredConfirmationWord}" para confirmar a exclusão.`;
        return;
    }

    this.isDeleting = true;
    this.clearMessages();

    this.profileService.deleteAccount().subscribe({
      next: () => {
        this.successMessage = 'Sua conta foi excluída com sucesso. Você será redirecionado.';
        this.showConfirmationDialog = false;
        this.confirmationInput = '';
        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 3000);
      },
      error: (err) => {
        console.error('Erro ao excluir conta:', err);
        this.errorMessage = err?.error?.message || err?.message || 'Ocorreu um erro ao tentar excluir sua conta.';
        this.isDeleting = false;
        // O diálogo permanece aberto em caso de erro para permitir nova tentativa.
      }
    });
  }

  private isDeletionConfirmedByInput(): boolean {
    return this.confirmationInput.toUpperCase() === this.requiredConfirmationWord.toUpperCase();
  }

  isConfirmButtonDisabled(): boolean {
    return this.isDeleting || !this.isDeletionConfirmedByInput();
  }

  private clearMessages(): void {
    this.successMessage = null;
    this.errorMessage = null;
  }

  onConfirmationInputChange(): void {
    if (this.errorMessage) {
      this.errorMessage = null;
    }
  }
}
