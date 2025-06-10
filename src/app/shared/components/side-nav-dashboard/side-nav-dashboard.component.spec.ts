import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SideNavDashboardComponent } from './side-nav-dashboard.component';

describe('SideNavDashboardComponent', () => {
  let component: SideNavDashboardComponent;
  let fixture: ComponentFixture<SideNavDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SideNavDashboardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SideNavDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
