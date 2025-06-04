import { HttpErrorResponse } from '@angular/common/http';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { QueueService } from '../../../services/queue.service';
import { Router } from '@angular/router';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';

export interface BookingConfirmationDetails {
  serviceId: number;
  serviceName: string;
  servicePrice: number;
  serviceDurationMinutes: number;
  serviceStaff: string;
  selectedFullDateTimeISO: string; 
  displayDate: string; 
  displayTimeRange: string; 
  optionalNote?: string;
}

@Component({
  selector: 'app-booking-confirmation',
  standalone: true,
  imports: [CommonModule, DatePipe,FormsModule],
  templateUrl: './booking-confirmation.component.html',
  styleUrl: './booking-confirmation.component.scss',
  providers: [DatePipe] 
})

export class BookingConfirmationComponent {
  @Input() details!: BookingConfirmationDetails; 

  @Output() goBack = new EventEmitter<void>(); 
  @Output() bookingFinalized = new EventEmitter<{ success: boolean; message?: string }>(); // To inform parent of outcome

  isBooking = false;
  feedbackMessage: { type: 'success' | 'error'; text: string } | null = null;
  optionalNote: string = ''; 

  constructor(
    private queueService: QueueService,
    private router: Router
  ) {}

  onGoBack(): void {
    if (this.isBooking) return; 
    this.goBack.emit();
  }

  onCloseModal(): void { 
    this.onGoBack();
  }

  confirmAndBook(): void {
    if (!this.details || this.isBooking) {
      return;
    }

    this.isBooking = true;
    this.feedbackMessage = null;

    this.queueService.createQueue(this.details.serviceId, this.details.selectedFullDateTimeISO).subscribe({
      next: () => {
        this.isBooking = false;
        this.feedbackMessage = { type: 'success', text: 'Marcação efetuada com sucesso!' };
        setTimeout(() => {
          this.bookingFinalized.emit({ success: true, message: this.feedbackMessage?.text });
        }, 2500); 
      },
      error: (err: HttpErrorResponse) => {
        this.isBooking = false;
        if (err.status === 401) { 
          this.feedbackMessage = { type: 'error', text: 'Sessão expirada. A redirecionar para o login...' };
          setTimeout(() => {
            this.router.navigate(['/login']); 
            this.bookingFinalized.emit({ success: false });
          }, 2000);
        } else if (err.status === 400 && err.error?.message) { 
          this.feedbackMessage = { type: 'error', text: err.error.message };
        } else { 
          this.feedbackMessage = { type: 'error', text: 'Ocorreu um erro ao confirmar a reserva. Tente novamente.' };
        }
        console.error("Error during final booking:", err);
      }
    });
  }
}
