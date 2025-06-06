import { Component } from '@angular/core';
import { Business } from '../../../model/business.model';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BusinessService } from '../../../services/business.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-business-info-form',

  templateUrl: './business-info-form.component.html',
  styleUrl: './business-info-form.component.scss'
})
export class BusinessInfoFormComponent {
  businessForm!: FormGroup;
  isLoading = false;
  errorMessage: string | null = null;
  successMessage: string | null = null;

  businessTypes: string[] = [
    "Barbershop", "Workshop", "Clinic", "Other", "Restaurant", "Gym",
    "Hairdresser", "Pet Store", "Consulting Room", "Pharmacy",
    "Photography Studio", "Cafeteria", "Spa", "School", "Cleaning Services",
    "Transportation", "Hotel", "Beauty Salon", "Laundry", "Kiosk",
    "Event Venue", "Bar", "Fast Food Restaurant", "Car Repair Shop",
    "Consultancy", "Design Services", "Tattoo Studio", "Massage Therapy",
    "Nail Salon", "Travel Agency"
  ];

  constructor(
    private fb: FormBuilder,
    private businessService: BusinessService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Sort business types alphabetically for better UX in the dropdown
    this.businessTypes.sort((a, b) => a.localeCompare(b));

    this.businessForm = this.fb.group({
      business_name: ['', Validators.required],
      business_type: [''], // Initialize with empty string for the placeholder option
      description: [''],
      business_email: ['', [Validators.email]],
      business_phone: [''],
      business_address: [''],
      opening_hour: [''],
      closing_hour: ['']
    });
  }

  onSubmit(): void {
    this.errorMessage = null;
    this.successMessage = null;
    if (this.businessForm.invalid) {
      this.businessForm.markAllAsTouched();
      Object.values(this.businessForm.controls).forEach(control => {
        control.markAsDirty(); // Ensure all fields are marked dirty to show errors if pristine
      });
      return;
    }

    this.isLoading = true;
    const businessData: Business = this.businessForm.value;

    this.businessService.createBusiness(businessData).subscribe({
      next: (createdBusiness) => {
        this.isLoading = false;
        this.successMessage = 'Negócio criado com sucesso!';
        if (createdBusiness.business_id) {
          setTimeout(() => {
             this.router.navigate(['/create-business/services', createdBusiness.business_id]);
          }, 1500);
        } else {
            this.errorMessage = "Erro: ID do negócio não retornado após criação.";
            console.error("Business ID missing in response", createdBusiness);
        }
      },
      error: (err) => {
        this.isLoading = false;
        this.errorMessage = err?.error?.message || 'Falha ao criar o negócio. Tente novamente.';
        console.error(err);
      }
    });
  }
}
