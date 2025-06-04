// src/app/features/user-account/user-account.module.ts
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common'; // Essencial para diretivas como *ngIf, *ngFor
import { RouterModule } from '@angular/router'; // Necessário para <router-outlet> e routerLink
import { ReactiveFormsModule } from '@angular/forms'; // Se seus componentes de configuração usarem formulários reativos

import { UserAccountRoutingModule } from './user-account-page-routing.module';
import { UserAccountPageComponent } from './user-account-page.component';
import { AccountSidebarComponent } from '../../shared/components/account-sidebar/account-sidebar.component';

@NgModule({
    declarations: [UserAccountPageComponent],
    imports: [
        CommonModule,
        RouterModule,
        ReactiveFormsModule, 
        UserAccountRoutingModule, 
        AccountSidebarComponent // Import standalone component
      ],
      exports: [
        AccountSidebarComponent,
        CommonModule, 
        RouterModule, 
      ],
})
export class UserAccountModule { }