// Importações essenciais do Angular e de bibliotecas externas (RxJS)
import { Component, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute } from '@angular/router'; // Importado para ler parâmetros da URL
import { forkJoin, of } from 'rxjs';
import { switchMap, catchError, tap, finalize } from 'rxjs/operators';

// Importe seus modelos de dados e serviços
import { Queue } from '../../../model/appointment.model';
import { Service } from '../../../model/business.model';
import { QueueService } from '../../../services/queue.service';
import { BusinessService } from '../../../services/business.service';

/**
 * Interface estendida para ajudar no posicionamento visual das marcações na grelha.
 * Adiciona propriedades visuais e de cálculo ao modelo `Queue` base.
 */
interface PositionedQueue extends Queue {
  top: number; // Posição em pixels a partir do topo da grelha (eixo Y)
  height: number; // Altura em pixels, baseada na duração do serviço
  left: number; // Posição percentual da esquerda, para evitar sobreposições
  width: number; // Largura percentual, para evitar sobreposições
  _start: number; // Propriedade interna para minutos de início (para cálculo de colisão)
  _end: number; // Propriedade interna para minutos de fim (para cálculo de colisão)
}

@Component({
  selector: 'app-dashboard-queues',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  providers: [DatePipe],
  templateUrl: './dashboard-queues.component.html',
  styleUrls: ['./dashboard-queues.component.scss'],
})
export class DashboardQueuesComponent implements OnInit {
  // Propriedade para armazenar o ID do negócio, obtido da URL. Começa como nulo.
  private businessId: number | null = null;

  // --- Estados da Interface do Utilizador (UI) ---
  isLoading = true;
  isModalOpen = false;
  modalMode: 'details' | 'create' = 'details';
  isLoadingAvailableTimes = false;
  feedbackMessage: { type: 'success' | 'error'; text: string } | null = null;

  // --- Dados da Aplicação ---
  allQueues: Queue[] = [];
  businessServices: Service[] = [];
  dailyQueues: PositionedQueue[][] = Array(7)
    .fill(0)
    .map(() => []);

  // --- Controlo do Formulário e do Modal ---
  createQueueForm: FormGroup;
  selectedQueueForModal: Queue | null = null;
  newQueueDate: string | null = null;
  newQueueTime: string | null = null;
  private targetTimeFromClick: string | null = null;

  // --- Helpers e Configurações da Agenda ---
  viewDate: Date = new Date();
  selectedDate: Date = new Date();
  readonly firstHourOfDay = 7;
  readonly lastHourOfDay = 20;
  timeSlots: string[] = [];
  miniCalendarDays: (Date | null)[] = [];
  weekDates: Date[] = [];
  monthNames = [
    'Janeiro',
    'Fevereiro',
    'Março',
    'Abril',
    'Maio',
    'Junho',
    'Julho',
    'Agosto',
    'Setembro',
    'Outubro',
    'Novembro',
    'Dezembro',
  ];
  weekDayNames = ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'];
  statusOptions: Queue['status'][] = [
    'waiting',
    'in_progress',
    'completed',
    'cancelled',
  ];

  constructor(
    private queueService: QueueService,
    private businessService: BusinessService,
    private datePipe: DatePipe,
    private fb: FormBuilder,
    private route: ActivatedRoute
  ) {
    this.createQueueForm = this.fb.group({
      serviceId: ['', Validators.required],
      client_name: ['', Validators.required],
      client_email: ['', [Validators.required, Validators.email]],
    });
  }

  /**
   * Método do ciclo de vida do Angular. É executado uma vez quando o componente é inicializado.
   * Configura a vista inicial da agenda e subscreve às mudanças na URL para carregar os dados.
   */
  ngOnInit(): void {
    this.generateTimeSlots();
    this.updateDateViews();
    this.route.paramMap
      .pipe(
        tap(() => (this.isLoading = true)),
        switchMap((params) => {
          const id = params.get('businessId') || params.get('id');
          if (id) {
            this.businessId = +id;
            return forkJoin({
              queues: this.queueService.getQueues(this.businessId),
              services: this.businessService.getBusinessServices(
                this.businessId
              ),
            }).pipe(
              catchError((err) => {
                console.error('Erro ao carregar dados iniciais:', err);
                this.setFeedback(
                  'error',
                  'Não foi possível carregar os dados da agenda.'
                );
                return of({ queues: [], services: [] });
              })
            );
          } else {
            console.error('ID do negócio não encontrado na URL.');
            this.setFeedback('error', 'ID do negócio não encontrado.');
            return of({ queues: [], services: [] });
          }
        })
      )
      .subscribe(({ queues, services }) => {
        this.allQueues = queues;
        this.businessServices = services;
        this.processQueuesForView();
        this.isLoading = false;
      });
  }

  /**
   * Chamado quando o utilizador seleciona um serviço no modal de criação.
   * Aciona a busca por horários disponíveis e ajusta a hora para a vaga mais próxima.
   */
  onServiceSelectionChange(): void {
    const serviceId = this.createQueueForm.get('serviceId')?.value;
    if (!serviceId || !this.newQueueDate || !this.targetTimeFromClick) {
      return;
    }

    this.isLoadingAvailableTimes = true;
    this.newQueueTime = null;
    this.queueService
      .getAvailableTimes(serviceId, this.newQueueDate)
      .pipe(finalize(() => (this.isLoadingAvailableTimes = false)))
      .subscribe({
        next: (response) => {
          if (response.availableTimes && response.availableTimes.length > 0) {
            const nearestTime = this.findNearestAvailableTime(
              this.targetTimeFromClick!,
              response.availableTimes
            );
            this.newQueueTime = this.datePipe.transform(nearestTime, 'HH:mm');
          } else {
            this.setFeedback(
              'error',
              'Nenhum horário disponível para este serviço no dia selecionado.'
            );
            this.newQueueTime = null;
          }
        },
        error: (err) => {
          console.error('Erro ao buscar horários disponíveis:', err);
          this.setFeedback('error', 'Não foi possível verificar os horários.');
        },
      });
  }

  /**
   * Encontra a hora disponível mais próxima (e futura) em relação a uma hora alvo.
   * @param targetTime - A hora do clique (ex: "13:15").
   * @param availableTimes - Um array de strings de data/hora ISO da API.
   * @returns A string de data/hora ISO mais próxima.
   */
  private findNearestAvailableTime(
    targetTime: string,
    availableTimes: string[]
  ): string {
    const targetMinutes =
      parseInt(targetTime.split(':')[0]) * 60 +
      parseInt(targetTime.split(':')[1]);
    let bestMatch = '';
    let smallestDiff = Infinity;

    for (const timeStr of availableTimes) {
      const availableDate = new Date(timeStr);
      const availableMinutes =
        availableDate.getUTCHours() * 60 + availableDate.getUTCMinutes();
      if (availableMinutes >= targetMinutes) {
        const diff = availableMinutes - targetMinutes;
        if (diff < smallestDiff) {
          smallestDiff = diff;
          bestMatch = timeStr;
        }
      }
    }
    return bestMatch || availableTimes[0];
  }

  /**
   * Chamado quando o utilizador clica num espaço vazio da grelha da agenda.
   * Calcula a data e hora do clique e abre o modal de criação.
   * @param event - O evento do clique do rato, para obter a posição Y.
   * @param dayIndex - O índice do dia na semana (0 a 6).
   */
  onTimeSlotClick(event: MouseEvent, dayIndex: number): void {
    const target = event.currentTarget as HTMLElement;
    const rect = target.getBoundingClientRect();
    const y = event.clientY - rect.top;
    const totalMinutesInColumn =
      (this.lastHourOfDay - this.firstHourOfDay) * 60;
    const clickedMinuteInDay =
      (y / rect.height) * totalMinutesInColumn + this.firstHourOfDay * 60;
    const roundedMinute = Math.round(clickedMinuteInDay / 15) * 15;
    const hour = Math.floor(roundedMinute / 60);
    const minute = roundedMinute % 60;
    const clickedDate = this.weekDates[dayIndex];
    const dateString = this.datePipe.transform(clickedDate, 'yyyy-MM-dd');
    const timeString = `${hour.toString().padStart(2, '0')}:${minute
      .toString()
      .padStart(2, '0')}`;
    this.openCreateModal(dateString, timeString);
  }

  /**
   * Abre o modal no modo de criação, pré-preenchendo a data e a hora.
   * Se chamado sem argumentos (pelo botão do cabeçalho), usa valores padrão.
   */
  openCreateModal(
    date: string | null = null,
    time: string | null = null
  ): void {
    this.modalMode = 'create';
    this.newQueueDate =
      date || this.datePipe.transform(this.selectedDate, 'yyyy-MM-dd');
    this.newQueueTime = time || '09:00';
    this.targetTimeFromClick = this.newQueueTime;
    this.createQueueForm.reset({
      serviceId: '',
      client_name: '',
      client_email: '',
    });
    this.isModalOpen = true;
  }

  /**
   * Submete o formulário de criação de uma nova marcação, enviando os dados para a API.
   */
  handleCreateQueue(): void {
    if (
      this.createQueueForm.invalid ||
      !this.newQueueDate ||
      !this.newQueueTime
    ) {
      this.setFeedback(
        'error',
        'Por favor, selecione um serviço e preencha todos os campos.'
      );
      return;
    }
    const formVal = this.createQueueForm.value;
    const queueDateISO = `${this.newQueueDate}T${this.newQueueTime}:00`;
    this.queueService
      .createQueueOwner(
        formVal.serviceId,
        queueDateISO,
        formVal.client_name,
        formVal.client_email
      )
      .subscribe({
        next: () => {
          this.setFeedback('success', 'Marcação criada com sucesso!');
          this.reloadData(new Date(queueDateISO));
          setTimeout(() => this.closeModal(), 1500);
        },
        error: (err) => {
          const errorMsg = err.error?.message || 'Erro ao criar a marcação.';
          this.setFeedback('error', errorMsg);
        },
      });
  }

  /**
   * Recarrega todos os dados da agenda a partir da API.
   * Útil após uma criação, atualização ou exclusão.
   * @param selectDateAfterLoad - Opcional. Data para focar após o carregamento.
   */
  reloadData(selectDateAfterLoad?: Date): void {
    if (!this.businessId) return;
    this.isLoading = true;
    forkJoin({
      queues: this.queueService.getQueues(this.businessId),
      services: this.businessService.getBusinessServices(this.businessId),
    }).subscribe({
      next: ({ queues, services }) => {
        this.allQueues = queues;
        this.businessServices = services;
        if (selectDateAfterLoad) {
          this.selectDate(selectDateAfterLoad);
        } else {
          this.processQueuesForView();
        }
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Erro ao recarregar dados:', err);
        this.isLoading = false;
        this.setFeedback(
          'error',
          'Não foi possível atualizar os dados da agenda.'
        );
      },
    });
  }

  /**
   * Processa as marcações para calcular o seu posicionamento visual na agenda,
   * lidando com sobreposições para que não fiquem umas em cima das outras.
   */
  processQueuesForView(): void {
    const pixelPerMinute = 1;
    const finalQueuesByDay: PositionedQueue[][] = Array(7)
      .fill(0)
      .map(() => []);
    for (let dayIndex = 0; dayIndex < 7; dayIndex++) {
      const day = this.weekDates[dayIndex];
      const dayStart = new Date(day);
      dayStart.setHours(0, 0, 0, 0);
      const dayEnd = new Date(day);
      dayEnd.setHours(23, 59, 59, 999);
      const queuesForDay = this.allQueues
        .filter((q) => {
          const queueDate = new Date(q.queue_date);
          return queueDate >= dayStart && queueDate <= dayEnd;
        })
        .map((queue) => {
          const service = this.businessServices.find(
            (s) => s.service_id === queue.service_id
          );
          const duration = service ? service.duration : 60;
          const queueDate = new Date(queue.queue_date);
          const startMinutes =
            queueDate.getHours() * 60 + queueDate.getMinutes();
          return {
            ...queue,
            top: (startMinutes - this.firstHourOfDay * 60) * pixelPerMinute,
            height: duration * pixelPerMinute,
            left: 0,
            width: 100,
            _start: startMinutes,
            _end: startMinutes + duration,
          };
        })
        .sort((a, b) => a._start - b._start || a._end - b._end);
      if (queuesForDay.length === 0) continue;
      const collisionGroups: PositionedQueue[][] = [];
      for (const queue of queuesForDay) {
        let placed = false;
        for (const group of collisionGroups) {
          const doesCollide = group.some(
            (existingQueue) =>
              queue._start < existingQueue._end &&
              queue._end > existingQueue._start
          );
          if (!doesCollide) {
            group.push(queue);
            placed = true;
            break;
          }
        }
        if (!placed) {
          collisionGroups.push([queue]);
        }
      }
      const totalColumns = collisionGroups.length;
      for (let i = 0; i < totalColumns; i++) {
        const group = collisionGroups[i];
        for (const queue of group) {
          queue.width = 100 / totalColumns;
          queue.left = i * queue.width;
        }
      }
      finalQueuesByDay[dayIndex] = queuesForDay;
    }
    this.dailyQueues = finalQueuesByDay;
  }

  /**
   * Atualiza as vistas do calendário e da agenda. Chamado quando a data muda.
   */
  updateDateViews(): void {
    this.generateMiniCalendar();
    this.generateWeekView();
    this.processQueuesForView();
  }

  /**
   * Abre o modal no modo de detalhes para exibir informações de uma marcação existente.
   * @param queue - A marcação que foi clicada.
   */
  openModal(queue: Queue): void {
    this.modalMode = 'details';
    this.selectedQueueForModal = { ...queue };
    this.isModalOpen = true;
  }

  /**
   * Fecha qualquer modal que esteja aberto e reinicia os seus estados.
   */
  closeModal(): void {
    this.isModalOpen = false;
    this.selectedQueueForModal = null;
    this.feedbackMessage = null;
    this.newQueueDate = null;
    this.newQueueTime = null;
  }

  /**
   * Chamado quando o status de uma marcação é alterado no modal de detalhes.
   * @param newStatus - O evento de mudança do elemento select.
   */
  handleStatusUpdate(newStatus: Event): void {
    const status = (newStatus.target as HTMLSelectElement)
      .value as Queue['status'];
    if (!this.selectedQueueForModal || !status) return;
    this.queueService
      .updateStatus(this.selectedQueueForModal.queue_id, { status })
      .subscribe({
        next: () => {
          this.setFeedback('success', 'Status atualizado com sucesso!');
          this.reloadData(this.viewDate);
          setTimeout(() => this.closeModal(), 1500);
        },
        error: () => this.setFeedback('error', 'Erro ao atualizar o status.'),
      });
  }

  /**
   * Exibe uma mensagem de feedback temporária para o utilizador.
   */
  private setFeedback(type: 'success' | 'error', text: string): void {
    this.feedbackMessage = { type, text };
    setTimeout(() => (this.feedbackMessage = null), 4000);
  }

  /**
   * Gera as etiquetas de hora (ex: "07:00", "08:00") para a coluna lateral da agenda.
   */
  generateTimeSlots(): void {
    this.timeSlots = Array.from(
      { length: this.lastHourOfDay - this.firstHourOfDay + 1 },
      (_, i) => `${(this.firstHourOfDay + i).toString().padStart(2, '0')}:00`
    );
  }

  /**
   * Gera os dias para preencher o mini-calendário, incluindo os espaços vazios no início.
   */
  generateMiniCalendar(): void {
    const y = this.viewDate.getFullYear(),
      m = this.viewDate.getMonth();
    const first = new Date(y, m, 1),
      last = new Date(y, m + 1, 0);
    const startDay = first.getDay() === 0 ? 6 : first.getDay() - 1;
    this.miniCalendarDays = [
      ...Array(startDay).fill(null),
      ...Array.from(
        { length: last.getDate() },
        (_, i) => new Date(y, m, i + 1)
      ),
    ];
  }

  /**
   * Gera os 7 objetos Date para a semana atualmente visível na agenda principal.
   */
  generateWeekView(): void {
    const start = this.getStartOfWeek(this.viewDate);
    this.weekDates = Array.from(
      { length: 7 },
      (_, i) =>
        new Date(start.getFullYear(), start.getMonth(), start.getDate() + i)
    );
  }

  /**
   * Chamado quando um dia é selecionado no mini-calendário.
   */
  selectDate(day: Date | null): void {
    if (!day) return;
    this.selectedDate = day;
    this.viewDate = day;
    this.updateDateViews();
  }

  /** Navega para a semana anterior. */
  previousWeek(): void {
    this.viewDate.setDate(this.viewDate.getDate() - 7);
    this.updateDateViews();
  }

  /** Navega para a próxima semana. */
  nextWeek(): void {
    this.viewDate.setDate(this.viewDate.getDate() + 7);
    this.updateDateViews();
  }

  /** Navega para o mês anterior no mini-calendário. */
  previousMonth(): void {
    this.viewDate.setMonth(this.viewDate.getMonth() - 1);
    this.updateDateViews();
  }

  /** Navega para o próximo mês no mini-calendário. */
  nextMonth(): void {
    this.viewDate.setMonth(this.viewDate.getMonth() + 1);
    this.updateDateViews();
  }

  /** Navega a vista da agenda para o dia de hoje. */
  goToToday(): void {
    this.viewDate = new Date();
    this.selectedDate = new Date();
    this.updateDateViews();
  }

  /** Verifica se uma data é o dia de hoje. */
  isToday(d: Date | null): boolean {
    return !!d && d.toDateString() === new Date().toDateString();
  }

  /** Verifica se uma data é o dia atualmente selecionado. */
  isSelected(d: Date | null): boolean {
    return !!d && d.toDateString() === this.selectedDate.toDateString();
  }

  /** Retorna o primeiro dia (Segunda-feira) da semana de uma data. */
  private getStartOfWeek(d: Date): Date {
    const date = new Date(d);
    const day = date.getDay();
    const diff = date.getDate() - day + (day === 0 ? -6 : 1);
    return new Date(date.setDate(diff));
  }

  /** Converte a chave do status (ex: 'in_progress') para um texto amigável. */
  getStatusText(s: Queue['status']): string {
    return (
      {
        waiting: 'Aguardando',
        in_progress: 'Em Atendimento',
        completed: 'Concluído',
        cancelled: 'Cancelado',
      }[s] || s
    );
  }
}
