import { Component, EventEmitter, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BookingModalComponent } from '../booking-modal/booking-modal.component';
import { Service } from '../../../model/business.model';
import { BookingConfirmationComponent, BookingConfirmationDetails } from "../booking-confirmation/booking-confirmation.component"; // Assuming this is correct

@Component({
  selector: 'app-service-card',
  standalone: true,
  imports: [CommonModule, FormsModule, BookingModalComponent, BookingConfirmationComponent],
  templateUrl: './service-card.component.html',
  styleUrls: ['./service-card.component.scss'],
})
export class ServiceCardComponent {
  @Input() service!: Service;
  @Input() businessNameForDisplay!: string;

  
  // Modal states
  isBookingModalOpen = false;
  isConfirmationScreenOpen = false;

  // Data for modals
  selectedServiceId!: number;
  modalServiceName!: string;
  modalServicePrice!: number;
  modalServiceDuration!: number;
  
  currentBookingConfirmationDetails: BookingConfirmationDetails | null = null;

  openBookingModal(service: Service) { 
    this.selectedServiceId = service.service_id;
    this.modalServiceName = service.service_name;
    this.modalServicePrice = service.price;
    this.modalServiceDuration = service.duration;
    
    this.isConfirmationScreenOpen = false;
    this.isBookingModalOpen = true;
  }
  
  closeBookingModal() {
    this.isBookingModalOpen = false;
  }

  handleProceedToConfirmation(details: BookingConfirmationDetails) {
    this.currentBookingConfirmationDetails = {
        ...details,
    };
    this.isBookingModalOpen = false;
    this.isConfirmationScreenOpen = true;
  }

  handleGoBackFromConfirmation() {
    this.isConfirmationScreenOpen = false;
    this.isBookingModalOpen = true; // Re-open the date/time selection
  }

  handleBookingFinalized(event: { success: boolean; message?: string }) {
    this.isConfirmationScreenOpen = false; // Close confirmation screen regardless of success/failure
    if (event.success) {
      console.log("Booking finalized successfully from parent:", event.message);
      // Optionally show a global toast message here
    } else {
      console.log("Booking failed or was aborted from parent.");
    }
    // Reset any necessary states in the parent if needed
  }
}
