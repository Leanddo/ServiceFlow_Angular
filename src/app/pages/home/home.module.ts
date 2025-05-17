import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeComponent } from './home.component';
import { ComoFuncionaModule } from '../../shared/components/home/como-funciona/como-funciona.module';
import { HomeRoutingModule } from './home-routing.module';
import { SharedModule } from "../../shared/components/home/service-scroll/service-scroll.module";
import { CountUpModule } from 'ngx-countup';

@NgModule({
  declarations: [HomeComponent],
  imports: [ComoFuncionaModule, CommonModule, HomeRoutingModule, SharedModule, CountUpModule],
})
export class HomeModule {
 
}
