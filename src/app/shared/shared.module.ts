import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NavBarComponent } from './components/nav-bar/nav-bar.component';
import { FooterComponent } from './components/footer/footer.component';
@NgModule({
  declarations: [NavBarComponent, FooterComponent],
  imports: [CommonModule, RouterModule],
  exports: [NavBarComponent, FooterComponent],
})
export class SharedModule {}
