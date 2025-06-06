import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { BusinessService } from '../services/business.service';

@Injectable({
  providedIn: 'root',
})
export class OwnerGuard implements CanActivate {
  constructor(private businessService: BusinessService, private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | Promise<boolean> | boolean {
    const businessId = route.params['businessId']; // Obtém o ID do negócio da rota

    return this.businessService.isOwner(businessId).pipe(
      map((isOwner: boolean) => {
        if (isOwner) {
          return true; // Permite o acesso
        } else {
          this.router.navigate(['/']); // Redireciona para uma página de erro
          return false;
        }
      }),
      catchError(() => {
        this.router.navigate(['/']); // Redireciona em caso de erro
        return [false];
      })
    );
  }
}