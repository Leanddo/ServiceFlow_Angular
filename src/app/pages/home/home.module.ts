import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeComponent } from './home.component';
import { ComoFuncionaModule } from '../../shared/components/home/como-funciona/como-funciona.module';
import { HomeRoutingModule } from './home-routing.module';
import { SharedModule } from "../../shared/components/home/service-scroll/service-scroll.module";
import { CountUpModule } from 'ngx-countup';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [HomeComponent],
  imports: [ComoFuncionaModule, CommonModule ,FormsModule ,HomeRoutingModule, SharedModule, CountUpModule],
})
export class HomeModule {
 
}
