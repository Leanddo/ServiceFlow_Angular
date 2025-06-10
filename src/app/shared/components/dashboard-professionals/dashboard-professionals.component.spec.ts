import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardProfessionalsComponent } from './dashboard-professionals.component';

describe('DashboardProfessionalsComponent', () => {
  let component: DashboardProfessionalsComponent;
  let fixture: ComponentFixture<DashboardProfessionalsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashboardProfessionalsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DashboardProfessionalsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
