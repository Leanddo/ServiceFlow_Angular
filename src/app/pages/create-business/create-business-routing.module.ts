import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CreateBusinessComponent } from './create-business.component';

import { BusinessPhotosUploadComponent } from '../../shared/components/business-photos-upload/business-photos-upload.component';
import { BusinessInfoFormComponent } from '../../shared/components/business-info-form/business-info-form.component';
import { BusinessProfessionalsComponent } from '../../shared/components/business-professionals/business-professionals.component';
import { OwnerGuard } from '../../guards/isBusinessOwner.guard';
import { AuthGuard } from '../../guards/Auth.guard';
import { BusinessServicesComponent } from '../../shared/components/business-services/business-services.component';
// Add guards if needed, e.g., to ensure business_id exists for photos/professionals steps

const routes: Routes = [
  {
    path: '',
    component: CreateBusinessComponent,
    children: [
      { path: '', redirectTo: 'info', pathMatch: 'full' }, // Default to info step
      {
        path: 'info',
        component: BusinessInfoFormComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'services/:businessId',
        component: BusinessServicesComponent,
        canActivate: [OwnerGuard, AuthGuard],
      },
      {
        path: 'photos/:businessId',
        component: BusinessPhotosUploadComponent,
        canActivate: [OwnerGuard, AuthGuard],
      },
      {
        path: 'professionals/:businessId',
        component: BusinessProfessionalsComponent,
        canActivate: [OwnerGuard, AuthGuard],
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CreateBusinessRoutingModule {}
