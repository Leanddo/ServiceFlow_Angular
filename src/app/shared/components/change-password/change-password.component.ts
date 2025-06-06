import { Component } from '@angular/core';
import { ProfileService } from '../../../services/profile.service';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss'],
})
export class ChangePasswordComponent {
  oldPassword: string = ''; // Propriedade para a senha atual
  newPassword: string = ''; // Propriedade para a nova senha

  constructor(private profileService: ProfileService) {}

  onSubmit(): void {
    if (this.oldPassword && this.newPassword) {
      this.profileService.changePassword(this.oldPassword, this.newPassword).subscribe({
        next: () => alert('Senha alterada com sucesso!'),
        error: () => alert('Erro ao alterar a senha. Tente novamente.'),
      });
    }
  }
}
