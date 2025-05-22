import { Component } from '@angular/core';
import {
  trigger,
  transition,
  style,
  animate,
  state,
} from '@angular/animations';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  animations: [
    trigger('slideInOut', [
      transition(':enter', [
        style({ transform: 'translateX(100%)', opacity: 0 }),
        animate(
          '600ms ease-out',
          style({ transform: 'translateX(0)', opacity: 1 })
        ),
      ]),
      transition(':leave', [
        animate(
          '600ms ease-in',
          style({ transform: 'translateX(-100%)', opacity: 0 })
        ),
      ]),
    ]),
  ],
})
export class HomeComponent {
  frases: string[] = [
    'Organiza. Agiliza. Cresce.',
    'A tua gestão de serviços, simplificada.',
    'Tudo o que precisas para gerir o teu negócio num só lugar.',
    'Menos papelada. Mais produtividade.',
    'Transforma a forma como geres serviços.',
  ];
  fraseAtual = 0;
  animationState = true;
  searchQuery: string = ''; // Variável para armazenar o valor do campo de entrada

  constructor(private router: Router) {
    setInterval(() => {
      this.animationState = false;
      setTimeout(() => {
        this.fraseAtual = (this.fraseAtual + 1) % this.frases.length;
        this.animationState = true;
      }, 600);
    }, 4000);
  }

  myServices = [
    { name: 'Barbearias', image: 'servicesImgs/barber.jpg', type: 'Barbershop' },
    { name: 'Cabeleireiros', image: 'servicesImgs/cabeleireiro.jpg', type: 'Hairdresser' },
    { name: 'Nail Artists', image: 'servicesImgs/nails.png', type: 'Nail Salon' },
    { name: 'Makeup artists', image: 'servicesImgs/makeup.png', type: 'Beauty Salon' },
    { name: 'Fitness', image: 'servicesImgs/fitness.png', type: 'Gym' },
    { name: 'Nutricionistas', image: 'servicesImgs/nutricionista.png', type: 'Clinic' },
    { name: 'Tatuadores', image: 'servicesImgs/tattoo.png', type: 'Tattoo Studio' },
    { name: 'Fisioterapeutas', image: 'servicesImgs/fisio.png', type: 'Massage Therapy' },
    { name: 'Consultas Médicas', image: 'servicesImgs/consulta.png', type: 'Consulting Room' },
    { name: 'Terapeutas', image: 'servicesImgs/terapia.png', type: 'Massage Therapy' },
    { name: 'Depilação', image: 'servicesImgs/depilacao.png', type: 'Beauty Salon' },
  ];

  onSearch(event: Event): void {
    event.preventDefault(); // Evita o comportamento padrão do formulário
    if (this.searchQuery.trim()) {
      // Redireciona para a página de serviços com o filtro de nome
      this.router.navigate(['/services'], {
        queryParams: { name: this.searchQuery },
      });
    }
  }
}
