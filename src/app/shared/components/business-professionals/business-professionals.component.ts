import { Component } from '@angular/core';
import { ProfessionalInvite } from '../../../model/business.model';
import { AbstractControl, FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BusinessService } from '../../../services/business.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-business-professionals',
  templateUrl: './business-professionals.component.html',
  styleUrl: './business-professionals.component.scss'
})
export class BusinessProfessionalsComponent {
  inviteForm!: FormGroup;
  businessId!: number;
  isLoading = false;
  errorMessage: string | null = null;
  successMessage: string | null = null;
  
  // Para preencher os dropdowns
  readonly daysOfWeek = ['Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sábado', 'Domingo'];
  
  readonly roles = [
    { display: 'Dono / Proprietário', value: 'Owner' },
    { display: 'Funcionário', value: 'Employee' },
    { display: 'Assistente', value: 'Assistant' },
    { display: 'Outro', value: 'Other' }
  ];

  constructor(
    private fb: FormBuilder,
    private businessService: BusinessService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('businessId');
    if (idParam) {
      this.businessId = +idParam;
    } else {
      // Idealmente, redirecionar ou mostrar um erro fatal
      this.errorMessage = "ID do negócio não encontrado. Não é possível enviar convites.";
    }

    this.inviteForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      role: ['', Validators.required],
      availability: this.fb.array([this.createAvailabilityGroup()], Validators.required)
    });
  }

  // --- GETTERS para facilitar o acesso no template ---
  get email() { return this.inviteForm.get('email'); }
  get role() { return this.inviteForm.get('role'); }
  get availability() { return this.inviteForm.get('availability') as FormArray; }

  // --- Métodos para gerenciar o FormArray de disponibilidade ---
  createAvailabilityGroup(): FormGroup {
    return this.fb.group({
      day: ['', Validators.required],
      start: ['', Validators.required],
      end: ['', Validators.required]
    }, { validators: this.timeRangeValidator });
  }

  addAvailability(): void {
    this.availability.push(this.createAvailabilityGroup());
  }

  removeAvailability(index: number): void {
    if (this.availability.length > 1) {
      this.availability.removeAt(index);
    }
  }

  // --- Validação Customizada ---
  timeRangeValidator(group: AbstractControl): { [key: string]: boolean } | null {
    const start = group.get('start')?.value;
    const end = group.get('end')?.value;
    if (start && end && start >= end) {
      return { 'timeRangeInvalid': true };
    }
    return null;
  }

  // --- Submissão do Formulário ---
  onSubmit(): void {
    this.errorMessage = null;
    this.successMessage = null;

    if (this.inviteForm.invalid) {
      this.inviteForm.markAllAsTouched(); // Mostra os erros de validação
      this.errorMessage = "Por favor, corrija os erros no formulário antes de enviar.";
      return;
    }
    
    if (!this.businessId) {
        this.errorMessage = "Erro crítico: ID do negócio ausente.";
        return;
    }

    this.isLoading = true;

    const inviteData: ProfessionalInvite = {
      ...this.inviteForm.value,
      isActive: false // O convite começa como inativo
    };

    this.businessService.inviteProfessional(this.businessId, inviteData).subscribe({
      next: (response) => {
        this.isLoading = false;
        this.successMessage = `Convite enviado com sucesso para ${inviteData.email}!`;
        // Opcional: resetar o formulário ou navegar para outra página
        this.inviteForm.reset();
        this.availability.clear();
        this.addAvailability();
        // this.router.navigate(['/dashboard', this.businessId, 'professionals']);
      },
      error: (err) => {
        this.isLoading = false;
        this.errorMessage = err.error?.message || 'Ocorreu um erro ao enviar o convite. Tente novamente.';
        console.error('Erro ao convidar profissional:', err);
      }
    });
  }

  proceedToDashboard(): void {
    if (this.businessId) {
      this.router.navigate(['/dashboard', this.businessId]);
    } else {
      console.error("Não é possível navegar: ID do negócio ausente.");
      this.errorMessage = "Ocorreu um erro. Não foi possível encontrar seu negócio para prosseguir.";
    }
  }
}
