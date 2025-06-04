import { Component, ElementRef, HostListener } from '@angular/core';
import { UserService } from '../../../services/user.service';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrl: './nav-bar.component.scss',
})
export class NavBarComponent {
  user: any = null;
  dropdownOpen = false;

  constructor(
    private userService: UserService,
    private eRef: ElementRef,
    private authService: AuthService
  ) {}

  @HostListener('document:click', ['$event'])
  clickOutside(event: MouseEvent): void {
    if (!this.eRef.nativeElement.contains(event.target)) {
      this.dropdownOpen = false;
    }
  }

  @HostListener('document:keydown.escape')
  closeDropdownOnEscape(): void {
    this.dropdownOpen = false;
  }

  ngOnInit(): void {
    this.userService.getProfile().subscribe({
      next: (res) => {
        this.user = res.profile;
      },
      error: () => {
        this.user = null;
      },
    });
  }
  
  toggleDropdown(): void {
    this.dropdownOpen = !this.dropdownOpen;
  }

  logout(): void {
    this.authService.logout();
    this.user = null;
  }
}
