import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ServiceScrollComponent } from './service-scroll.component';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [ServiceScrollComponent],
  imports: [CommonModule,RouterModule],
  exports: [ServiceScrollComponent] // para poderes usá-lo noutros módulos
})
export class SharedModule {}
