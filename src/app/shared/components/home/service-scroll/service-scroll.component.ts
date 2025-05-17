import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-service-scroll',
  templateUrl: './service-scroll.component.html',
  styleUrl: './service-scroll.component.scss',
})
export class ServiceScrollComponent {
  @Input() services: { image: string; name: string }[] = [];
}
