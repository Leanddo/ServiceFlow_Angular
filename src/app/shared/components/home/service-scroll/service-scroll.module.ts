import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ServiceScrollComponent } from './service-scroll.component';

@NgModule({
  declarations: [ServiceScrollComponent],
  imports: [CommonModule],
  exports: [ServiceScrollComponent] // para poderes usá-lo noutros módulos
})
export class SharedModule {}
