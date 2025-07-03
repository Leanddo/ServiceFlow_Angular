import {
  Component,
  OnInit,
  OnDestroy,
  Input,
  Output,
  EventEmitter,
} from '@angular/core';
import { BusinessSummary } from '../../../model/business.model';
import { BusinessService } from '../../../services/business.service';
import { NavigationEnd, Router, ActivatedRouteSnapshot } from '@angular/router';
import { UserService } from '../../../services/user.service';
import { UserProfile } from '../../../model/user-profile.model';
import { filter, takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

interface NavItem {
  path: string;
  label: string;
  icon: string;
}

@Component({
  selector: 'app-side-nav-dashboard',
  templateUrl: './side-nav-dashboard.component.html',
  styleUrls: ['./side-nav-dashboard.component.scss'], // Corrigido de styleUrl para styleUrls
})
export class SideNavDashboardComponent implements OnInit, OnDestroy {
  @Input() isOpen = false;
  @Output() closeSidebar = new EventEmitter<void>();
  @Output() logout = new EventEmitter<void>();

  private allNavItems: NavItem[] = [
    { path: 'business', label: 'Negócio', icon: 'assets/icons/mala.svg' },
    { path: 'services', label: 'Serviços', icon: 'assets/icons/tool.svg' },
    {
      path: 'professionals',
      label: 'Profissionais',
      icon: 'assets/icons/profile.svg',
    },
    { path: 'queues', label: 'Filas', icon: 'assets/icons/list.svg' },
  ];
  private destroy$ = new Subject<void>();
  public visibleNavItems: NavItem[] = [];
  public businessList: BusinessSummary[] = [];
  public selectedBusiness: BusinessSummary | null = null;
  public isLoadingBusinesses = true;
  public userProfile: UserProfile | null = null;

  constructor(
    private businessService: BusinessService,
    private router: Router,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.loadUserProfile();
    this.loadBusinessesAndSetupRouting();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  // ... resto das suas funções (loadBusinessesAndSetupRouting, etc.)
  // O código aqui não precisa ser alterado para a funcionalidade do botão.

  private loadBusinessesAndSetupRouting(): void {
    this.isLoadingBusinesses = true;
    this.businessService
      .getBusinessesByProfessional()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (businesses: BusinessSummary[]) => {
          this.businessList = businesses;
          this.isLoadingBusinesses = false;

          if (!businesses || businesses.length === 0) {
            return;
          }

          this.setupRouteListener();

          const businessIdFromUrl = this.findBusinessIdInRouteTree(
            this.router.routerState.snapshot.root
          );
          this.updateSelectedBusiness(businessIdFromUrl);
        },
        error: (err) => {
          console.error('Erro ao carregar negócios:', err);
          this.isLoadingBusinesses = false;
        },
      });
  }

  private setupRouteListener(): void {
    this.router.events
      .pipe(
        filter(
          (event): event is NavigationEnd => event instanceof NavigationEnd
        ),
        takeUntil(this.destroy$)
      )
      .subscribe(() => {
        const businessIdFromUrl = this.findBusinessIdInRouteTree(
          this.router.routerState.snapshot.root
        );
        this.updateSelectedBusiness(businessIdFromUrl);
      });
  }

  private updateSelectedBusiness(businessId: number | null): void {
    let businessToSelect: BusinessSummary | undefined;

    if (businessId) {
      businessToSelect = this.businessList.find(
        (b) => b.business_id === businessId
      );
    }

    if (
      businessToSelect &&
      this.selectedBusiness?.business_id === businessToSelect.business_id
    ) {
      return;
    }

    if (!businessToSelect && this.businessList.length > 0) {
      businessToSelect = this.businessList[0];
      if (!businessId) {
        this.router.navigate([
          '/dashboard',
          'services',
          businessToSelect.business_id,
        ]);
        return;
      }
    }

    if (businessToSelect) {
      this.selectedBusiness = businessToSelect;
      this.filterNavItemsByRole(businessToSelect.role);
    }
  }

  private findBusinessIdInRouteTree(
    route: ActivatedRouteSnapshot
  ): number | null {
    let currentRoute: ActivatedRouteSnapshot | null = route;
    while (currentRoute) {
      if (currentRoute.paramMap.has('businessId')) {
        return Number(currentRoute.paramMap.get('businessId'));
      }
      currentRoute = currentRoute.firstChild;
    }
    return null;
  }

  private loadUserProfile(): void {
    this.userService
      .getProfile()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (profile) => {
          this.userProfile = profile;
        },
        error: (err) => {
          console.error('Erro ao carregar o perfil do utilizador:', err);
        },
      });
  }

  public onBusinessChange(event: Event): void {
    const newBusinessId = Number((event.target as HTMLSelectElement).value);
    const currentUrl = this.router.url;
    const urlSegments = currentUrl.split('/');
    const currentPage = urlSegments[2] || 'services';

    this.router.navigate(['/dashboard', currentPage, newBusinessId]);
  }

  private filterNavItemsByRole(role: string): void {
    if (role === 'Owner' || role === 'Manager') {
      this.visibleNavItems = this.allNavItems;
    } else if (role === 'Employee'|| role === 'Assistant' || role === 'Other') {
      this.visibleNavItems = this.allNavItems.filter(
        (item) => item.path === 'queues'
      );
    } else {
      this.visibleNavItems = [];
    }
  }
}
