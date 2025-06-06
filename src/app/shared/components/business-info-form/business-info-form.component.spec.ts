import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BusinessInfoFormComponent } from './business-info-form.component';

describe('BusinessInfoFormComponent', () => {
  let component: BusinessInfoFormComponent;
  let fixture: ComponentFixture<BusinessInfoFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BusinessInfoFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BusinessInfoFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
