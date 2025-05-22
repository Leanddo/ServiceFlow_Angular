import { Component, HostListener } from '@angular/core';
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

  constructor(private userService: UserService, private authService: AuthService) {}

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    const target = event.target as HTMLElement;
    if (!target.closest('.dropdown')) {
      this.dropdownOpen = false;
    }
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

  logout(): void {
    this.authService.logout();
    this.user = null;
  }
}
