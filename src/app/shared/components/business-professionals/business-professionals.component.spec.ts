import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BusinessProfessionalsComponent } from './business-professionals.component';

describe('BusinessProfessionalsComponent', () => {
  let component: BusinessProfessionalsComponent;
  let fixture: ComponentFixture<BusinessProfessionalsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BusinessProfessionalsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BusinessProfessionalsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
