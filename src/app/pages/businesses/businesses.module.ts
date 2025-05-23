import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { BusinessesComponent } from './businesses.component';
import { businessesRoutingModule } from './businesses-routing.module';

@NgModule({
  declarations: [BusinessesComponent],
  imports: [CommonModule, businessesRoutingModule, ReactiveFormsModule, RouterModule],
})
export class BusinessesModule {}
