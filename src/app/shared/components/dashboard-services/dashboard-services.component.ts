import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { catchError, finalize, of } from 'rxjs';
import { Service } from '../../../model/business.model';
import { BusinessService } from '../../../services/business.service';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-dashboard-services',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './dashboard-services.component.html',
  styleUrl: './dashboard-services.component.scss',
})
export class DashboardServicesComponent implements OnInit {
  services: Service[] = [];
  isLoading = true;
  private businessId: number | null = null;

  isModalOpen = false;
  isDeleteModalOpen = false;
  modalMode: 'create' | 'edit' = 'create';
  selectedService: Service | null = null;
  serviceForm: FormGroup;

  constructor(
    private businessService: BusinessService,
    private fb: FormBuilder,
    private route: ActivatedRoute
  ) {
    this.serviceForm = this.fb.group({
      service_name: ['', [Validators.required]],
      description: [''],
      price: [0, [Validators.required, Validators.min(0)]],
      duration: [30, [Validators.required, Validators.min(1)]],
      category: [''],
    });
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      const id = params.get('businessId');
      if (id) {
        this.businessId = +id;
        this.loadServices();
      } else {
        console.error('ID do negócio não encontrado na URL.');
        this.isLoading = false;
      }
    });
  }

  loadServices(): void {
    if (!this.businessId) {
      this.isLoading = false;
      return;
    }

    this.isLoading = true;
    this.businessService
      .getBusinessServicesPrivate(this.businessId) 
      .pipe(
        finalize(() => (this.isLoading = false)),
        catchError(() => {
          console.error('Falha ao carregar os serviços.');
          return of([]);
        })
      )
      .subscribe((data) => (this.services = data));
  }

  handleFormSubmit(): void {
    if (this.serviceForm.invalid) return;

    if (!this.businessId) {
      console.error('Não é possível salvar: ID do negócio é nulo.');
      return;
    }

    const serviceData = this.serviceForm.value;
    const operation =
      this.modalMode === 'edit' && this.selectedService
        ? this.businessService.updateService(
            this.businessId,
            this.selectedService.service_id,
            serviceData
          )
        : this.businessService.createService(this.businessId, serviceData);

    operation.subscribe({
      next: () => {
        this.loadServices();
        this.closeModal();
      },
      error: (err) => console.error('Falha ao salvar o serviço:', err),
    });
  }

  onToggleStatus(service: Service, event: Event): void {
    event.stopPropagation();

    if (!this.businessId) return;

    const newStatus = !service.isActive;
    this.businessService
      .patchServiceStatus(this.businessId, service.service_id, newStatus)
      .subscribe({
        next: (updatedService) => this.updateServiceInList(updatedService),
        error: (err) => console.error('Falha ao atualizar o status:', err),
      });
  }

  confirmDelete(): void {
    if (!this.selectedService || !this.businessId) return; 

    this.businessService
      .deleteService(this.businessId, this.selectedService.service_id)
      .subscribe({
        next: () => {
          this.loadServices();
          this.closeDeleteConfirmation();
        },
        error: (err) => {
          console.error('Falha ao excluir o serviço:', err);
          this.closeDeleteConfirmation();
        },
      });
  }

  onFileSelected(event: Event, service: Service): void {
    const input = event.target as HTMLInputElement;
    if (!input.files?.length || !this.businessId) return; 
    const file = input.files[0];

    this.businessService
      .updateBusinessServicesPhoto(this.businessId, service.service_id, file)
      .subscribe({
        next: (updatedService) => {
          this.updateServiceInList(updatedService);
   
        },
        error: (err) => console.error('Erro no upload da foto:', err),
      });
  }

  onDeletePhoto(service: Service, event: Event): void {
    event.stopPropagation();
    if (!this.businessId) return; // CORREÇÃO 6: Adicionar verificação de guarda

    this.businessService
      .deleteBusinessServicesPhoto(this.businessId, service.service_id)
      .subscribe({
        next: (updatedService) => {
          this.updateServiceInList(updatedService);
        },
        error: (err) => console.error('Erro ao deletar a foto:', err),
      });
  }

  // --- Funções de gestão de modais (sem erros de tipagem) ---
  openCreateModal(): void {
    this.modalMode = 'create';
    this.serviceForm.reset({ price: 0, duration: 30 });
    this.isModalOpen = true;
  }
  openEditModal(service: Service): void {
    this.modalMode = 'edit';
    this.selectedService = service;
    this.serviceForm.patchValue(service);
    this.isModalOpen = true;
  }
  closeModal(): void {
    this.isModalOpen = false;
  }
  openDeleteConfirmation(service: Service, event: Event): void {
    event.stopPropagation();
    this.selectedService = service;
    this.isDeleteModalOpen = true;
  }
  closeDeleteConfirmation(): void {
    this.isDeleteModalOpen = false;
    this.selectedService = null;
  }
  private updateServiceInList(updatedService: Service): void {
    const index = this.services.findIndex(
      (s) => s.service_id === updatedService.service_id
    );
    if (index !== -1) {
      this.services[index] = updatedService;
    }
  }
}
