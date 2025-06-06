import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms'; // Import FormsModule if using template-driven forms anywhere

import { CreateBusinessRoutingModule } from './create-business-routing.module';
import { CreateBusinessComponent } from './create-business.component';
import { BusinessInfoFormComponent } from '../../shared/components/business-info-form/business-info-form.component';
import { BusinessPhotosUploadComponent } from '../../shared/components/business-photos-upload/business-photos-upload.component';
import { BusinessProfessionalsComponent } from '../../shared/components/business-professionals/business-professionals.component';
import { BusinessServicesComponent } from '../../shared/components/business-services/business-services.component';

// Import any shared modules if necessary (e.g., for common UI components)

@NgModule({
  declarations: [
    CreateBusinessComponent,
    BusinessInfoFormComponent,
    BusinessPhotosUploadComponent,
    BusinessProfessionalsComponent,
    BusinessServicesComponent
  ],
  imports: [
    CommonModule,
    CreateBusinessRoutingModule,
    ReactiveFormsModule,
    FormsModule // Add if needed
    // SharedModule (if you have one with common components/pipes)
  ]
})
export class CreateBusinessModule { }