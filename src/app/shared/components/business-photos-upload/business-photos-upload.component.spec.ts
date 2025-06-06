import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BusinessPhotosUploadComponent } from './business-photos-upload.component';

describe('BusinessPhotosUploadComponent', () => {
  let component: BusinessPhotosUploadComponent;
  let fixture: ComponentFixture<BusinessPhotosUploadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BusinessPhotosUploadComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BusinessPhotosUploadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
