import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardQueuesComponent } from './dashboard-queues.component';

describe('DashboardQueuesComponent', () => {
  let component: DashboardQueuesComponent;
  let fixture: ComponentFixture<DashboardQueuesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashboardQueuesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DashboardQueuesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
