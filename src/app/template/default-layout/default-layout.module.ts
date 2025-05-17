import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DefaultLayoutComponent } from './default-layout.component';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../../shared/shared.module';
import { DefaultLayoutRoutingModule } from './default-layout.routes';

@NgModule({
  declarations: [DefaultLayoutComponent],
  imports: [
    CommonModule,
    RouterModule,
    SharedModule,
    DefaultLayoutRoutingModule
  ],
})

export class DefaultLayoutModule {}
