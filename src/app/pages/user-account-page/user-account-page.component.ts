import { Component, OnDestroy, OnInit } from '@angular/core';
import { AccountSidebarComponent } from "../../shared/components/account-sidebar/account-sidebar.component";
import { filter, map, mergeMap, Subject, takeUntil } from 'rxjs';
import { ActivatedRoute, Data, NavigationEnd, Router } from '@angular/router';
import { UserService } from '../../services/user.service';
import { UserProfile, UserProfileResponse } from '../../model/user-profile.model';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-user-account-page',
  templateUrl: './user-account-page.component.html',
  styleUrl: './user-account-page.component.scss',
})

export class UserAccountPageComponent implements OnInit, OnDestroy {
  
  userData: UserProfile | null = null; // <<< CORRIGIDO: Usar UserProfile consistentemente
  currentTitle: string = '';
  isLoadingUserProfile: boolean = true;

  private destroy$ = new Subject<void>();

  constructor(
    private userService: UserService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private authService: AuthService // Certifique-se de que o AuthService está importado corretamente
  ) {}

  ngOnInit(): void {
    this.fetchUserProfile();
    this.subscribeToRouteData();
  }

  fetchUserProfile(): void {
    this.isLoadingUserProfile = true;
    this.userService.getProfile().pipe(
      map((response: UserProfileResponse) => response.profile),
      takeUntil(this.destroy$)
    ).subscribe({
      next: (profile: UserProfile) => { 
        this.userData = profile;
        this.isLoadingUserProfile = false;
        this.updateWelcomeTitleIfNeeded(); 
      },
      error: (err) => {
        console.error('Erro ao buscar perfil do usuário:', err);
        this.userData = { username: 'Usuário', email: '', fotoUrl: null, role: '' };
        this.isLoadingUserProfile = false;
        this.updateWelcomeTitleIfNeeded(); 
      },
    });
  }

  subscribeToRouteData(): void {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd),
      map(() => {
        let route = this.activatedRoute.firstChild;
        while (route?.firstChild) {
          route = route.firstChild;
        }
        return route;
      }),
      filter(route => !!route && route.outlet === 'primary'),
      mergeMap(route => route!.data),
      takeUntil(this.destroy$)
    ).subscribe((data: Data | undefined) => {
      this.currentTitle = data?.['title'] || 'Minha Conta'; 
      this.updateWelcomeTitleIfNeeded(); 
    });

    if (this.activatedRoute.firstChild) {
      this.activatedRoute.firstChild.data.pipe(takeUntil(this.destroy$)).subscribe(data => {
         if (data?.['title'] && (this.currentTitle === 'Minha Conta' || !this.currentTitle) ) {
            this.currentTitle = data['title'];
            this.updateWelcomeTitleIfNeeded();
         }
      });
    }
  }

  updateWelcomeTitleIfNeeded(): void {
    const currentUrl = this.router.url; 
    const isProfileDetailsRoute = currentUrl.endsWith('/details') || currentUrl.endsWith('/user-account'); // Ajuste conforme suas rotas

    if (this.userData && isProfileDetailsRoute) {
      this.currentTitle = `Bem-vindo, ${this.userData.username || 'Usuário'}!`;
    }
  }

  onOutletActivated(component: any) {
  }

  handleLogout(): void {
    console.log('Logout solicitado pelo usuário.');
    this.authService.logout();
    alert('Funcionalidade de logout a ser implementada!');
    this.router.navigate(['/login']);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
