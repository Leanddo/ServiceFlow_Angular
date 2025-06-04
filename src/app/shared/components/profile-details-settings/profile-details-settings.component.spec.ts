import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfileDetailsSettingsComponent } from './profile-details-settings.component';

describe('ProfileDetailsSettingsComponent', () => {
  let component: ProfileDetailsSettingsComponent;
  let fixture: ComponentFixture<ProfileDetailsSettingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProfileDetailsSettingsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProfileDetailsSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
