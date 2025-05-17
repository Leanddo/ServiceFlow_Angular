import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { BlankLayoutComponent } from './blank-layout.component';
import { BlankLayoutRoutingModule } from './blank-layout.routes';

@NgModule({
  declarations: [BlankLayoutComponent],
  imports: [CommonModule, RouterModule, BlankLayoutRoutingModule],
  exports: [BlankLayoutComponent],
})
export class BlankLayoutModule {}
