// src/app/shared/components/business-services/business-services.component.ts

import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { BusinessService } from '../../../services/business.service';
import { Service as BusinessServiceModel } from '../../../model/business.model';
import { finalize, forkJoin } from 'rxjs';

@Component({
  selector: 'app-business-services',
  templateUrl: './business-services.component.html',
  styleUrls: ['./business-services.component.scss'],
})
export class BusinessServicesComponent implements OnInit {
  addServiceForm!: FormGroup;
  addedServices: BusinessServiceModel[] = [];

  businessId!: number;
  isLoading = false;
  errorMessage: string | null = null;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private businessService: BusinessService
  ) {}

  ngOnInit(): void {
    this.businessId = +this.route.snapshot.paramMap.get('businessId')!;

    // CORREÇÃO: O formulário agora usa os nomes exatos do seu modelo: 'price' e 'duration'.
    this.addServiceForm = this.fb.group({
      service_name: ['', [Validators.required, Validators.minLength(3)]],
      description: [''],
      price: [null, [Validators.required, Validators.min(0)]],
      duration: [60, [Validators.required, Validators.min(5)]],
      category: ['', [Validators.required, Validators.minLength(3)]],
    });
  }

  addServiceToList(): void {
    if (this.addServiceForm.invalid) {
      this.addServiceForm.markAllAsTouched();
      return;
    }

    // MUDANÇA: O novo objeto é do tipo BusinessServiceModel, sem tempId.
    const newService: BusinessServiceModel = this.addServiceForm.value;
    this.addedServices.push(newService);

    this.addServiceForm.reset({
      duration: 60,
    });
  }

  removeServiceFromList(index: number): void {
    this.addedServices.splice(index, 1); 
  }

  submitAllServices(): void {
    if (this.addedServices.length === 0) {
      this.errorMessage =
        'Você deve adicionar pelo menos um serviço para continuar.';
      return;
    }

    if (!this.businessId) {
      this.errorMessage = 'Erro: ID do negócio não encontrado.';
      return;
    }

    this.isLoading = true;
    this.errorMessage = null;

    const servicesToSubmit = this.addedServices;

    // Envia os serviços um por um
    const requests = servicesToSubmit.map((service) =>
      this.businessService.createService(this.businessId, service)
    );

    // Aguarda todas as requisições serem concluídas
    forkJoin(requests)
      .pipe(finalize(() => (this.isLoading = false)))
      .subscribe({
        next: () => {
          this.router.navigate([`/create-business/photos/${this.businessId}`]);        },
        error: (err) => {
          this.errorMessage =
            'Ocorreu um erro ao salvar os serviços. Tente novamente.';
          console.error(err);
        },
      });
  }

  get service_name() {
    return this.addServiceForm.get('service_name');
  }
  get price() {
    return this.addServiceForm.get('price');
  }
  get duration() {
    return this.addServiceForm.get('duration');
  }
}
