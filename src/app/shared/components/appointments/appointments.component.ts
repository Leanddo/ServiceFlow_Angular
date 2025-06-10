import { Component, OnInit, OnDestroy } from '@angular/core';
import { QueueService } from '../../../services/queue.service';
import { Subscription } from 'rxjs';
import { Appointment } from '../../../model/appointment.model';

@Component({
  selector: 'app-appointments',
  templateUrl: './appointments.component.html',
  styleUrls: ['./appointments.component.scss'],
})
export class AppointmentsComponent implements OnInit, OnDestroy {
  appointments: Appointment[] = [];
  selectedAppointment: Appointment | null = null;
  showCancelConfirmation: boolean = false;
  isProcessingCancellation: boolean = false;
  errorMessage: string | null = null;

  private appointmentsSubscription: Subscription | undefined;
  private cancelSubscription: Subscription | undefined;

  constructor(private queueService: QueueService) {}

  ngOnInit(): void {
    this.loadAppointments();
  }

  loadAppointments(): void {
    this.errorMessage = null;
    this.appointmentsSubscription = this.queueService.getUserAppointments().subscribe({
      next: (data: Appointment[]) => {
        console.log('Appointments fetched successfully:', data);
        this.appointments = data.sort((a, b) => new Date(b.queue_date).getTime() - new Date(a.queue_date).getTime());
      },
      error: (err) => {
        console.error('Error fetching appointments:', err);
        this.errorMessage = 'Não foi possível carregar seus agendamentos. Tente novamente mais tarde.';
        this.appointments = [];
      }
    });
  }

  getStatusDisplayName(status: string): string {
    const statusMap: { [key: string]: string } = {
      waiting: 'Aguardando',
      confirmed: 'Confirmado',
      completed: 'Concluído',
      cancelled: 'Cancelado', // Usado para display e estado local
      canceled: 'Cancelado',  // Potencialmente retornado pela API ou usado para enviar à API
      // Adicione outros status se necessário
    };
    return statusMap[status?.toLowerCase()] || status;
  }

  formatWaitTime(timeString: string | null): string {
    if (!timeString) return '';
    const parts = timeString.split(':');
    if (parts.length >= 2) {
      const hours = parseInt(parts[0], 10);
      const minutes = parseInt(parts[1], 10);
      if (hours > 0 && minutes > 0) {
        return `${hours}h ${minutes}min`;
      } else if (hours > 0) {
        return `${hours}h`;
      } else if (minutes > 0) {
        return `${minutes}min`;
      }
    }
    return '';
  }

  toggleDetails(appointment: Appointment): void {
    if (this.selectedAppointment === appointment && !this.showCancelConfirmation) {
      this.closeModal();
    } else {
      this.selectedAppointment = appointment;
      this.showCancelConfirmation = false;
      this.errorMessage = null; // Limpa erros ao abrir/trocar detalhes
    }
  }

  closeModal(): void {
    this.selectedAppointment = null;
    this.showCancelConfirmation = false;
  }

  // Helper para verificar se a data do agendamento é futura
  isAppointmentFuture(appointment: Appointment | null): boolean {
    if (!appointment) return false;
    return new Date(appointment.queue_date) > new Date();
  }

  canCancel(appointment: Appointment | null): boolean {
    if (!appointment) return false;
    const currentStatus = appointment.status?.toLowerCase();
    return currentStatus !== 'completed' &&
           currentStatus !== 'cancelled' && // Verifica o estado local 'cancelled'
           currentStatus !== 'canceled' &&  // Verifica o estado 'canceled' (caso a API retorne assim)
           this.isAppointmentFuture(appointment);
  }

  openCancelConfirmation(appointment: Appointment): void {
    // Verificação defensiva, embora o botão no HTML deva ser o principal controlador
    if (!this.canCancel(appointment)) {
      console.warn("Tentativa de abrir confirmação para agendamento não cancelável.");
      this.errorMessage = "Este agendamento não pode mais ser cancelado.";
      // Garante que o agendamento correto está selecionado para mostrar detalhes (mesmo sem opção de cancelar)
      this.selectedAppointment = appointment;
      this.showCancelConfirmation = false;
      return;
    }

    // Se o modal não estiver aberto para este appointment, ou se a confirmação não estiver visível
    if (this.selectedAppointment !== appointment || !this.showCancelConfirmation) {
        this.selectedAppointment = appointment;
        this.showCancelConfirmation = true;
        this.errorMessage = null; // Limpa erros ao abrir confirmação
    }
  }

  closeCancelConfirmation(): void {
    this.showCancelConfirmation = false;
  }

  confirmCancellation(appointmentId: number): void {
    if (!this.selectedAppointment || this.selectedAppointment.queue_id !== appointmentId) {
        console.error("Erro: Agendamento selecionado não corresponde ao ID para cancelamento.");
        this.errorMessage = "Ocorreu um erro. Tente selecionar o agendamento novamente.";
        return;
    }

    // Verificação defensiva adicional: o agendamento ainda pode ser cancelado?
    if (!this.canCancel(this.selectedAppointment)) {
        console.warn("Tentativa de confirmar cancelamento para agendamento não cancelável (estado pode ter mudado).");
        this.errorMessage = 'Este agendamento não pode mais ser cancelado.';
        this.showCancelConfirmation = false; // Fecha a confirmação
        this.isProcessingCancellation = false; // Reseta o estado de processamento
        // Atualiza o estado do selectedAppointment para refletir o status atual, se necessário
        // Ex: this.loadAppointments(); ou busca específica do appointment
        return;
    }

    this.isProcessingCancellation = true;
    this.errorMessage = null;

    const statusForApi = 'cancelled'; // Status enviado para a API (com um 'l')
    const localStatusAfterCancel: Appointment['status'] = 'cancelled'; // ✅ CORRETO // Status usado localmente e no display (com dois 'l's)

    this.cancelSubscription = this.queueService.updateStatus(appointmentId, {status: statusForApi}).subscribe({
      next: (response) => {
        console.log('Agendamento cancelado com sucesso:', response);
        const index = this.appointments.findIndex(app => app.queue_id === appointmentId);
        if (index !== -1) {
          this.appointments[index].status = localStatusAfterCancel; // Atualiza na lista
          // Se o modal estiver mostrando este agendamento, atualize-o também
          if (this.selectedAppointment && this.selectedAppointment.queue_id === appointmentId) {
            this.selectedAppointment.status = localStatusAfterCancel; // Atualiza o selecionado
          }
        }
        this.showCancelConfirmation = false; // Fecha a seção de confirmação
      },
      error: (err) => {
        console.error('Erro ao cancelar agendamento:', err);
        // Tenta pegar uma mensagem de erro mais específica da API, se disponível
        this.errorMessage = err?.error?.message || err?.message || 'Não foi possível cancelar o agendamento. Tente novamente.';
      },
      complete: () => {
        this.isProcessingCancellation = false;
      }
    });
  }

  ngOnDestroy(): void {
    if (this.appointmentsSubscription) {
      this.appointmentsSubscription.unsubscribe();
    }
    if (this.cancelSubscription) {
      this.cancelSubscription.unsubscribe();
    }
  }
}