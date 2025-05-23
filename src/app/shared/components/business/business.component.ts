import { Component } from '@angular/core';
import {
  BusinessService,
  BusinessWithExtras,
} from '../../../services/business.service';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CarouselModule } from 'ngx-owl-carousel-o';
import { ServiceCardComponent } from "../service-card/service-card.component";

@Component({
  selector: 'app-business',
  standalone: true,
  imports: [CommonModule, FormsModule, CarouselModule, ServiceCardComponent],
  templateUrl: './business.component.html',
  styleUrl: './business.component.scss',
})
export class BusinessComponent {
  business!: BusinessWithExtras['business'];
  services: BusinessWithExtras['services'] = [];
  rating!: BusinessWithExtras['rating'];
  professionals!: BusinessWithExtras['professionals'];
/*   businessPhotos: BusinessWithExtras['photos'];
 */  loading = true;

  constructor(
    private businessService: BusinessService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    // Get the business ID from the route
    const businessId = this.route.snapshot.paramMap.get('id');
    if (businessId) {
      this.loadBusinessDetails(+businessId);
    }
  }

  loadBusinessDetails(businessId: number): void {
    this.loading = true;

    this.businessService
      .getBusinessById(businessId)
      .subscribe((businessData) => {
        if (businessData) {
          this.business = businessData.business;
          this.services = businessData.services;
          this.rating = businessData.rating;
          this.professionals = businessData.professionals;
          this.businessPhotos = businessData.photos || [];
        }

        this.loading = false;
      });
  }

  getStarStyle(
    averageRating: number,
    index: number
  ): { [key: string]: string } {
    const fillPercentage =
      Math.min(Math.max(averageRating - index, 0), 1) * 100;
    return {
      '--fill': `${fillPercentage}%`,
    };
  }

  carouselOptions = {
    loop: true,
    margin: 10,
    nav: true,
    dots: true,
    autoplay: true,
    autoplayTimeout: 3000,
    autoplayHoverPause: true,
    responsive: {
      0: {
        items: 1,
      },
      600: {
        items: 2,
      },
      1000: {
        items: 3,
      },
    },
  };

  businessPhotos = [
    { photo_url: 'https://via.placeholder.com/600x400', description: 'Photo 1' },
    { photo_url: 'https://via.placeholder.com/600x400', description: 'Photo 2' },
    { photo_url: 'https://via.placeholder.com/600x400', description: 'Photo 3' },
  ];
}
