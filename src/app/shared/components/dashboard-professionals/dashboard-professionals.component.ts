import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
  FormArray,
} from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import {
  Professionals,
  ProfessionalInvite,
  ProfessionalUpdateData,
  AvailabilitySlot,
} from '../../../model/business.model';
import { BusinessService } from '../../../services/business.service';
import { catchError, finalize, of, switchMap, tap } from 'rxjs'; 

@Component({
  selector: 'app-dashboard-professionals',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './dashboard-professionals.component.html',
  styleUrls: ['./dashboard-professionals.component.scss'],
})
export class DashboardProfessionalsComponent implements OnInit {
  isLoading = true;
  businessId: number | null = null; 
  professionals: Professionals[] = [];

  isInviteModalVisible = false;
  isEditModalVisible = false;

  inviteForm: FormGroup;
  editForm: FormGroup;

  selectedProfessional: Professionals | null = null;

  isSubmitting = false;
  feedbackMessage: { type: 'success' | 'error'; text: string } | null = null;

  readonly roles = ['Manager', 'Employee', "Assistant", "Other"];
  readonly weekDays = ['Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sábado', 'Domingo'];
  readonly timeSlots = this.generateTimeSlots();

  constructor(
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private businessService: BusinessService
  ) {
    this.inviteForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      role: ['Employee', Validators.required],
    });

    this.editForm = this.fb.group({
      role: ['', Validators.required],
      isActive: [true],
      availability: this.fb.array([]),
    });
  }


  ngOnInit(): void {
    this.route.paramMap.pipe(
      tap(() => this.isLoading = true), 
      switchMap(params => {
        const businessIdParam = params.get('businessId');
        if (businessIdParam) {
          this.businessId = Number(businessIdParam);
          return this.businessService.getPrivateBusinessProfessionals(this.businessId).pipe(
            catchError(err => {
              console.error('Erro ao carregar profissionais:', err);
              this.showFeedback('error', 'Não foi possível carregar a lista de profissionais.');
              return of([]); 
            })
          );
        } else {
          this.showFeedback('error', 'ID do negócio não encontrado na rota.');
          return of([]); 
        }
      })
    ).subscribe(data => {
      this.professionals = data;
      this.isLoading = false;
    });
  }

  loadProfessionals(): void {
    if (!this.businessId) {
      this.isLoading = false;
      return;
    }
    this.isLoading = true;
    this.businessService
      .getPrivateBusinessProfessionals(this.businessId)
      .pipe(
        finalize(() => this.isLoading = false)
      )
      .subscribe({
        next: (data) => {
          this.professionals = data;
        },
        error: (err) => {
          console.error('Erro ao recarregar profissionais:', err);
          this.showFeedback('error', 'Não foi possível recarregar a lista de profissionais.');
        },
      });
  }

  // --- LÓGICA DO MODAL DE CONVITE ---
  openInviteModal(): void {
    this.inviteForm.reset({ role: 'Employee' });
    this.isInviteModalVisible = true;
    this.feedbackMessage = null;
  }

  onInviteSubmit(): void {
    if (this.inviteForm.invalid || !this.businessId) {
      return;
    }
    this.isSubmitting = true;

    const formValue = this.inviteForm.value;
    const inviteData: ProfessionalInvite = {
      email: formValue.email,
      role: formValue.role,
      availability: [],
      isActive: true,
    };

    this.businessService.inviteProfessional(this.businessId, inviteData)
      .pipe(finalize(() => this.isSubmitting = false))
      .subscribe({
        next: () => {
          this.isInviteModalVisible = false;
          this.showFeedback('success', `Convite enviado com sucesso para ${inviteData.email}.`);
          this.loadProfessionals();
        },
        error: (err) => {
          this.showFeedback('error', err.error?.message || 'Ocorreu um erro ao enviar o convite.');
        },
      });
  }

  // --- LÓGICA DO MODAL DE EDIÇÃO ---
  get availabilityControls() {
    return (this.editForm.get('availability') as FormArray).controls;
  }

  openEditModal(professional: Professionals): void {
    this.selectedProfessional = professional;
    this.feedbackMessage = null;

    const availabilityFA = this.editForm.get('availability') as FormArray;
    availabilityFA.clear();
    
    // Garantir que professional.availability é um array antes de iterar
    if (Array.isArray(professional.availability)) {
      professional.availability.forEach((slot: AvailabilitySlot) => {
        availabilityFA.push(this.createAvailabilityGroup(slot.day, slot.start, slot.end));
      });
    }

    this.editForm.patchValue({
      role: professional.role,
      isActive: professional.isActive,
    });

    this.isEditModalVisible = true;
  }

  createAvailabilityGroup(day = '', start = '09:00', end = '17:00'): FormGroup {
    return this.fb.group({
      day: [day, Validators.required],
      start: [start, Validators.required],
      end: [end, Validators.required],
    });
  }

  addAvailability(): void {
    const availabilityFA = this.editForm.get('availability') as FormArray;
    availabilityFA.push(this.createAvailabilityGroup());
  }

  removeAvailability(index: number): void {
    const availabilityFA = this.editForm.get('availability') as FormArray;
    availabilityFA.removeAt(index);
  }

  onEditSubmit(): void {
    if (this.editForm.invalid || !this.selectedProfessional || !this.businessId) {
      return;
    }
    this.isSubmitting = true;
    const updateData: ProfessionalUpdateData = this.editForm.value;

    this.businessService
      .updateProfessional(this.selectedProfessional.professional_id!, this.businessId, updateData)
      .pipe(finalize(() => this.isSubmitting = false))
      .subscribe({
        next: () => {
          this.isEditModalVisible = false;
          this.showFeedback('success', 'Profissional atualizado com sucesso.');
          this.loadProfessionals();
        },
        error: (err) => {
          this.showFeedback('error', err.error?.message || 'Ocorreu um erro ao atualizar o profissional.');
        },
      });
  }

  // --- HELPERS E UI ---
  closeModal(): void {
    this.isInviteModalVisible = false;
    this.isEditModalVisible = false;
    this.selectedProfessional = null;
    this.feedbackMessage = null;
  }

  showFeedback(type: 'success' | 'error', text: string): void {
    this.feedbackMessage = { type, text };
    setTimeout(() => {
      this.feedbackMessage = null;
    }, 5000);
  }

  private generateTimeSlots(): string[] {
    const slots = [];
    for (let h = 0; h < 24; h++) {
      for (let m = 0; m < 60; m += 30) {
        const hour = h.toString().padStart(2, '0');
        const minute = m.toString().padStart(2, '0');
        slots.push(`${hour}:${minute}`);
      }
    }
    return slots;
  }
}