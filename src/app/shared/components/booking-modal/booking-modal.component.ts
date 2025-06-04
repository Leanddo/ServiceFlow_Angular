import {
  Component,
  Input,
  OnInit,
  Output,
  EventEmitter,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import { QueueService } from '../../../services/queue.service'; // Adjust path as per your project
import { CommonModule, DatePipe } from '@angular/common';
import { BookingConfirmationDetails } from '../booking-confirmation/booking-confirmation.component'; // Adjust path

interface DisplayDay {
  label: string;
  value: string; // ISO date "YYYY-MM-DD"
  dayNameShort: string;
  dayNumber: number;
  isAvailable: boolean;
}

@Component({
  selector: 'app-booking-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './booking-modal.component.html',
  styleUrls: ['./booking-modal.component.scss'],
  providers: [DatePipe],
})
export class BookingModalComponent implements OnInit, OnChanges {
  // Interfaces are declared
  @Input() serviceId!: number;
  @Input() isOpen = false;
  @Input() serviceNameDisplay: string = 'Service Name';
  @Input() servicePrice: number = 0;
  @Input() serviceDurationMinutes: number = 0;
  @Input() serviceStaff: string = 'Any Staff';
  @Input() businessNameToDisplay: string = 'Seu Estabelecimento';

  @Output() closeModal = new EventEmitter<void>();
  @Output() proceedToConfirmation =
    new EventEmitter<BookingConfirmationDetails>();

  currentMonthYearLabel: string = '';
  displayDays: DisplayDay[] = [];
  selectedDate: string | null = null; // <<<< CORRIGIDO AQUI

  timePeriods = ['Manhã', 'Tarde', 'Noite'];
  selectedPeriod: string = 'Manhã';

  allAvailableTimesForDay: string[] = [];
  filteredTimesForPeriod: string[] = [];
  selectedTime: string | null = null;

  isLoadingTimes: boolean = false;

  private dayCarouselStartIndex = 0;
  private readonly daysToShowInCarousel = 7;
  private allGeneratedDays: DisplayDay[] = [];

  constructor(private queueService: QueueService, private datePipe: DatePipe) {}

  ngOnInit(): void {
    if (this.isOpen) {
      this.initializeComponentState();
    } else {
      if (this.allGeneratedDays.length === 0) {
        this.generateAllPossibleDays(60); // Aumentado para mais flexibilidade inicial
      }
      this.updateCurrentMonthYearLabel();
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['isOpen']) {
      if (this.isOpen) {
        this.initializeComponentState();
      }
    }
    if (
      changes['serviceId'] &&
      this.isOpen &&
      !changes['serviceId'].firstChange &&
      this.selectedDate
    ) {
      this.loadAvailableTimes();
    }
  }

  initializeComponentState(): void {
    let dateToInitialize: string | null = this.selectedDate;

    if (this.allGeneratedDays.length === 0) {
      this.generateAllPossibleDays(60);
    }

    if (dateToInitialize) {
      const dateExists = this.allGeneratedDays.some(
        (d) => d.value === dateToInitialize
      );
      if (!dateExists) {
        dateToInitialize = null;
      }
    }

    if (!dateToInitialize && this.allGeneratedDays.length > 0) {
      const firstAvailableDay = this.allGeneratedDays.find(
        (d) => d.isAvailable
      );
      dateToInitialize = firstAvailableDay
        ? firstAvailableDay.value
        : this.allGeneratedDays[0].value;
    }

    if (dateToInitialize) {
      if (this.selectedDate !== dateToInitialize || !this.displayDays.length) {
        this.selectDate(dateToInitialize);
      } else {
        this.recenterCarouselOnSelectedDate();
        this.loadAvailableTimes();
        this.updateDisplayedDaysCarousel();
      }
    } else {
      this.dayCarouselStartIndex = 0;
      this.displayDays = [];
      this.allAvailableTimesForDay = [];
      this.filteredTimesForPeriod = [];
      this.selectedDate = null;
      this.selectedTime = null;
      this.updateCurrentMonthYearLabel();
    }
  }

  generateAllPossibleDays(numberOfDays: number): void {
    this.allGeneratedDays = [];
    const today = new Date();
    for (let i = 0; i < numberOfDays; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      date.setHours(0, 0, 0, 0);

      const iso = date.toISOString().split('T')[0];
      const dayNameShort = (
        this.datePipe.transform(date, 'EEE') || 'Dia'
      ).substring(0, 3);

      this.allGeneratedDays.push({
        label: this.datePipe.transform(date, 'MMM d') || iso,
        value: iso,
        dayNameShort: dayNameShort,
        dayNumber: date.getDate(),
        isAvailable: true,
      });
    }
  }

  private recenterCarouselOnSelectedDate(): void {
    if (!this.selectedDate || this.allGeneratedDays.length === 0) return;

    const selectedIndex = this.allGeneratedDays.findIndex(
      (d) => d.value === this.selectedDate
    );
    if (selectedIndex !== -1) {
      let startIndex =
        selectedIndex - Math.floor(this.daysToShowInCarousel / 2);
      startIndex = Math.max(0, startIndex);
      if (this.allGeneratedDays.length > this.daysToShowInCarousel) {
        startIndex = Math.min(
          startIndex,
          this.allGeneratedDays.length - this.daysToShowInCarousel
        );
      } else {
        startIndex = 0;
      }
      this.dayCarouselStartIndex = startIndex;
    }
  }

  updateDisplayedDaysCarousel(): void {
    if (this.allGeneratedDays.length <= this.daysToShowInCarousel) {
      this.dayCarouselStartIndex = 0;
    } else {
      this.dayCarouselStartIndex = Math.min(
        this.dayCarouselStartIndex,
        this.allGeneratedDays.length - this.daysToShowInCarousel
      );
      this.dayCarouselStartIndex = Math.max(0, this.dayCarouselStartIndex);
    }

    this.displayDays = this.allGeneratedDays.slice(
      this.dayCarouselStartIndex,
      this.dayCarouselStartIndex + this.daysToShowInCarousel
    );
    this.updateCurrentMonthYearLabel();
  }

  navigateDayCarousel(direction: 'prev' | 'next'): void {
    const step = 1;
    if (direction === 'prev') {
      this.dayCarouselStartIndex = Math.max(
        0,
        this.dayCarouselStartIndex - step
      );
    } else {
      this.dayCarouselStartIndex = Math.min(
        this.allGeneratedDays.length - this.daysToShowInCarousel,
        this.dayCarouselStartIndex + step
      );
    }
    this.updateDisplayedDaysCarousel();
  }

  get canNavigateDayPrev(): boolean {
    return this.dayCarouselStartIndex > 0;
  }

  get canNavigateDayNext(): boolean {
    return (
      this.dayCarouselStartIndex + this.daysToShowInCarousel <
      this.allGeneratedDays.length
    );
  }

  updateCurrentMonthYearLabel(): void {
    if (this.displayDays.length > 0) {
      const middleDisplayDayIndex = Math.floor(this.displayDays.length / 2);
      const referenceDayValue = this.displayDays[middleDisplayDayIndex]?.value;
      if (referenceDayValue) {
        const dateObj = new Date(referenceDayValue + 'T12:00:00'); // Use T12 to avoid DST shifts for date part
        this.currentMonthYearLabel =
          this.datePipe.transform(dateObj, 'MMMM yyyy') || 'Mês Ano';
      } else {
        this.currentMonthYearLabel =
          this.datePipe.transform(new Date(), 'MMMM yyyy') || 'Mês Ano';
      }
    } else if (this.allGeneratedDays.length > 0) {
      const firstDayObj = new Date(
        this.allGeneratedDays[0].value + 'T12:00:00'
      );
      this.currentMonthYearLabel =
        this.datePipe.transform(firstDayObj, 'MMMM yyyy') || 'Mês Ano';
    } else {
      this.currentMonthYearLabel =
        this.datePipe.transform(new Date(), 'MMMM yyyy') || 'Mês Ano';
    }
  }

  selectDate(dateValue: string) {
    if (
      this.selectedDate === dateValue &&
      this.allAvailableTimesForDay.length > 0
    )
      return;

    this.selectedDate = dateValue;
    this.selectedTime = null;
    this.allAvailableTimesForDay = [];
    this.filteredTimesForPeriod = [];

    this.recenterCarouselOnSelectedDate();
    this.updateDisplayedDaysCarousel();
    this.loadAvailableTimes();
  }

  loadAvailableTimes() {
    if (!this.serviceId || !this.selectedDate) {
      this.allAvailableTimesForDay = [];
      this.filteredTimesForPeriod = [];
      this.isLoadingTimes = false;
      return;
    }
    this.isLoadingTimes = true;
    // selectedDate é garantido ser string aqui por causa da verificação acima
    this.queueService
      .getAvailableTimes(this.serviceId, this.selectedDate)
      .subscribe({
        next: (response) => {
          console.log(
            `[BookingModal] Raw availableTimes for ${this.selectedDate}:`,
            JSON.parse(JSON.stringify(response.availableTimes))
          ); // LOG ADICIONADO
          this.allAvailableTimesForDay = response.availableTimes.sort(
            (a, b) => new Date(a).getTime() - new Date(b).getTime()
          );
          console.log(
            '[BookingModal] Sorted allAvailableTimesForDay:',
            JSON.parse(JSON.stringify(this.allAvailableTimesForDay))
          ); // LOG ADICIONADO
          this.filterTimesByPeriod();
          this.isLoadingTimes = false;
        },
        error: (err) => {
          console.error(
            'Error loading available times for service ' +
              this.serviceId +
              ' on ' +
              this.selectedDate +
              ':',
            err
          );
          this.allAvailableTimesForDay = [];
          this.filterTimesByPeriod();
          this.isLoadingTimes = false;
        },
      });
  }

  selectPeriod(period: string): void {
    if (this.selectedPeriod === period) return;

    this.selectedPeriod = period;
    this.selectedTime = null;
    this.filterTimesByPeriod();
  }

  filterTimesByPeriod(): void {
    if (
      !this.allAvailableTimesForDay ||
      this.allAvailableTimesForDay.length === 0
    ) {
      this.filteredTimesForPeriod = [];
      return;
    }
    // LOG ADICIONADO para ver os dados antes de filtrar e o período selecionado
    console.log(
      `[BookingModal] Filtering for period: "${this.selectedPeriod}" from times:`,
      JSON.parse(JSON.stringify(this.allAvailableTimesForDay))
    );

    this.filteredTimesForPeriod = this.allAvailableTimesForDay.filter(
      (isoDateTimeString) => {
        const localDate = new Date(isoDateTimeString);
        const localHour = localDate.getHours();
        let include = false;

        if (this.selectedPeriod === 'Manhã')
          include = localHour >= 6 && localHour < 12;
        if (this.selectedPeriod === 'Tarde')
          include = localHour >= 12 && localHour < 18;
        if (this.selectedPeriod === 'Noite')
          include = localHour >= 18 && localHour < 24; // ou < 23 se preferir até 22:59

        // Para depuração mais detalhada de cada slot (descomente se necessário):
        // console.log(`  Time: ${isoDateTimeString} (Local: ${localDate.toLocaleTimeString()} - Hour: ${localHour}), Period: ${this.selectedPeriod}, Include: ${include}`);
        return include;
      }
    );
    // LOG ADICIONADO para ver o resultado da filtragem
    console.log(
      `[BookingModal] Filtered times for "${this.selectedPeriod}":`,
      JSON.parse(JSON.stringify(this.filteredTimesForPeriod))
    );
  }

  selectTime(isoDateTimeString: string) {
    this.selectedTime = isoDateTimeString;
  }

  formatTimeToDisplay(isoDateTimeString: string | null): string {
    if (!isoDateTimeString) return '';
    return this.datePipe.transform(isoDateTimeString, 'HH:mm') || '';
  }

  get selectedServiceEndTime(): string | null {
    if (this.selectedTime && this.serviceDurationMinutes > 0) {
      const startTime = new Date(this.selectedTime);
      const endTime = new Date(
        startTime.getTime() + this.serviceDurationMinutes * 60000
      );
      return this.formatTimeToDisplay(endTime.toISOString());
    }
    return null;
  }

  confirmAndProceed(): void {
    if (!this.selectedTime || !this.selectedDate) {
      alert('Por favor, selecione um dia e um horário válidos.');
      return;
    }

    const selectedDateObj = new Date(this.selectedDate + 'T12:00:00');

    const monthName = this.datePipe.transform(selectedDateObj, 'MMMM');
    const dayOfWeekName = this.datePipe.transform(selectedDateObj, 'EEEE');
    const dayOfMonth = selectedDateObj.getDate();
    const year = selectedDateObj.getFullYear();

    let displayDateStr = `${monthName}, ${dayOfWeekName} ${dayOfMonth} ${year}`;
    displayDateStr =
      displayDateStr.charAt(0).toUpperCase() + displayDateStr.slice(1);

    const startTimeDisplay = this.formatTimeToDisplay(this.selectedTime!);
    const endTimeDisplay = this.selectedServiceEndTime;
    const displayTimeRangeStr = `${startTimeDisplay} - ${endTimeDisplay} (${this.serviceDurationMinutes}min)`;

    const details: BookingConfirmationDetails = {
      serviceId: this.serviceId,
      serviceName: this.serviceNameDisplay,
      servicePrice: this.servicePrice,
      serviceDurationMinutes: this.serviceDurationMinutes,
      serviceStaff: this.serviceStaff,
      selectedFullDateTimeISO: this.selectedTime!,
      displayDate: displayDateStr,
      displayTimeRange: displayTimeRangeStr,
    };

    this.proceedToConfirmation.emit(details);
  }

  onClose() {
    this.closeModal.emit();
  }
}
