import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { CommonModule } from '@angular/common';

interface SidebarItem {
  label: string;
  route: string;
  icon?: string;
  exactMatch?: boolean;
}

@Component({
  selector: 'app-account-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './account-sidebar.component.html',
  styleUrls: ['./account-sidebar.component.scss'],
})
export class AccountSidebarComponent {
  @Input() userName: string | null = '';
  @Input() userPhone: string | null = '';
  @Input() userAvatarUrl: string | null = null;

  @Output() logout = new EventEmitter<void>();

  sidebarItems: SidebarItem[] = [
    { label: 'Página inicial do perfil', route: 'details', exactMatch: true },
    { label: 'Agendamentos', route: 'appointments' },
    {
      label: 'Configurações da conta',
      route: 'details',
    },
    { label: 'Detalhes do Perfil', route: 'details' },
    { label: 'Foto de Perfil', route: 'image' },
    { label: 'Alterar Senha', route: 'password' },
    { label: 'Excluir Conta', route: 'delete-account' },
  ];

  uniqueSidebarItems: SidebarItem[] = [];

  constructor(private router: Router, private authService: AuthService) {}

  ngOnInit(): void {
    if (!this.userAvatarUrl) {
      this.userAvatarUrl = 'assets/icons/profile.svg';
    }

    const seenRoutes = new Set<string>();
    this.uniqueSidebarItems = this.sidebarItems.filter((item) => {
      if (item.label === 'Configurações da conta') return false;
      if (seenRoutes.has(item.route)) {
        return false;
      }
      seenRoutes.add(item.route);
      return true;
    });
  }

  onLogout() {
    this.logout.emit();
    this.authService.logout();
  }
}
