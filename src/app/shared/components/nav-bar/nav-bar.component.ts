import { Component, ElementRef, HostListener, ViewChild } from '@angular/core';
import { UserService } from '../../../services/user.service';
import { AuthService } from '../../../services/auth.service';
import { Subject, takeUntil } from 'rxjs';
import { UserProfile } from '../../../model/user-profile.model';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrl: './nav-bar.component.scss',
})
export class NavBarComponent {
  // --- PROPRIEDADES DO COMPONENTE ---
  user: UserProfile | null = null;
  dropdownOpen = false;
  isMenuOpen = false; // NOVO: Controla o estado do menu hambúrguer

  // Usado para cancelar subscrições e evitar memory leaks
  private readonly destroy$ = new Subject<void>();

  // NOVO: Referência direta ao elemento do DOM que contém as infos do usuário
  @ViewChild('userInfo') userInfoRef?: ElementRef;

  constructor(
    private userService: UserService,
    private authService: AuthService
  ) {}

  // --- LIFECYCLE HOOKS ---
  ngOnInit(): void {
    // Busca o perfil inicial do usuário se ele já estiver logado (ex: F5 na página)
    this.userService.getProfile().pipe(
      takeUntil(this.destroy$) // Garante que a subscrição é cancelada na destruição
    ).subscribe({
      next: (user) => (this.user = user),
      error: () => (this.user = null),
    });

    // Escuta continuamente por mudanças no estado de autenticação (login/logout)
    // Esta é a principal fonte da verdade para o estado do usuário.
    this.authService.user$.pipe(
      takeUntil(this.destroy$) // Essencial para subscrições de longa duração
    ).subscribe((user) => {
      this.user = user;
      if (!user) {
        // Garante que o dropdown feche no logout
        this.dropdownOpen = false;
      }
    });
  }

  ngOnDestroy(): void {
    // Emite um valor para notificar todas as subscrições para se completarem
    this.destroy$.next();
    this.destroy$.complete();
  }

  // --- LISTENERS GLOBAIS DE EVENTOS ---
  /**
   * Fecha o dropdown do usuário se um clique ocorrer fora da sua área.
   * Usar @ViewChild é mais preciso do que usar ElementRef no componente inteiro.
   */
  @HostListener('document:click', ['$event'])
  clickOutside(event: MouseEvent): void {
    if (this.user && this.userInfoRef && !this.userInfoRef.nativeElement.contains(event.target)) {
      this.dropdownOpen = false;
    }
  }

  /**
   * Fecha os menus (hambúrguer ou dropdown) ao pressionar a tecla 'Escape'.
   */
  @HostListener('document:keydown.escape')
  closeOnEscape(): void {
    if (this.isMenuOpen) {
      this.toggleMenu(); // Prioriza fechar o menu principal
    } else if (this.dropdownOpen) {
      this.dropdownOpen = false;
    }
  }

  // --- MÉTODOS DE CONTROLE DA UI ---

  /**
   * Alterna a visibilidade do dropdown do perfil do usuário.
   */
  toggleDropdown(): void {
    this.dropdownOpen = !this.dropdownOpen;
  }

  /**
   * Alterna a visibilidade do menu hambúrguer e controla o scroll da página.
   */
  toggleMenu(): void {
    this.isMenuOpen = !this.isMenuOpen;
    // Impede o scroll da página quando o menu está aberto para uma melhor UX
    document.body.style.overflow = this.isMenuOpen ? 'hidden' : 'auto';
  }

  /**
   * Fecha ambos os menus. Útil para ser chamado ao navegar para outra rota.
   */
  closeMenus(): void {
    this.dropdownOpen = false;
    if (this.isMenuOpen) {
      this.toggleMenu(); // Reutiliza a lógica para resetar o overflow do body
    }
  }

  /**
   * Realiza o logout do usuário.
   */
  logout(): void {
    this.authService.logout();
    this.closeMenus(); // Garante que todos os menus fechem após o logout
    // Não é mais necessário fazer `this.user = null` aqui,
    // pois a subscrição ao `authService.user$` já cuidará disso.
  }
}
