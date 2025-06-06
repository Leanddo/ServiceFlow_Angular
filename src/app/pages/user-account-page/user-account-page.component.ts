import { Component, OnDestroy, OnInit } from '@angular/core';
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
  
  userData: UserProfile | null = null; 
  currentTitle: string = '';
  isLoadingUserProfile: boolean = true;

  sidenavItems = [
    { label: 'Detalhes do Perfil', route: '/user-account/details', active: false },
    { label: 'Excluir Conta', route: '/user-account/delete-account', active: false },
    { label: 'Agendamentos', route: '/user-account/appointments', active: false },
  ];

  private destroy$ = new Subject<void>();

  constructor(
    private userService: UserService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private authService: AuthService 
  ) {}

  ngOnInit(): void {
    this.fetchUserProfile();
    this.subscribeToRouteData();
  }

  fetchUserProfile(): void {
    this.isLoadingUserProfile = true;
    this.userService.getProfile().pipe(
      takeUntil(this.destroy$)
    ).subscribe({
      next: (profile) => { 
        console.log('Perfil do usuário carregado:', profile); // Debug: Log the loaded user profile
        this.userData = profile;
        this.isLoadingUserProfile = false;
      },
      error: (err) => {
        console.error('Erro ao buscar perfil do usuário:', err);
        this.router.navigate(['/']);
        this.userData = { username: 'Usuário', email: '', fotoUrl: null, role: '' };
        this.isLoadingUserProfile = false;
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
    });

    if (this.activatedRoute.firstChild) {
      this.activatedRoute.firstChild.data.pipe(takeUntil(this.destroy$)).subscribe(data => {
         if (data?.['title'] && (this.currentTitle === 'Minha Conta' || !this.currentTitle) ) {
            this.currentTitle = data['title'];
         }
      });
    }
  }

  handleLogout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  navigateTo(route: string): void {
    this.sidenavItems.forEach((item) => (item.active = item.route === route));
    this.router.navigate([route]);
  }

  onOutletActivated(event: any): void {
    console.log('Router outlet activated with component:', event); 
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
