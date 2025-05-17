import { Component } from '@angular/core';
import {
  trigger,
  transition,
  style,
  animate,
  state,
} from '@angular/animations';

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

  constructor() {
    setInterval(() => {
      this.animationState = false;
      setTimeout(() => {
        this.fraseAtual = (this.fraseAtual + 1) % this.frases.length;
        this.animationState = true;
      }, 600); 
    }, 4000); 
  }

  myServices = [
    { name: 'Barbearias', image: 'servicesImgs/barber.jpg' },
    { name: 'Cabeleireiros', image: 'servicesImgs/cabeleireiro.jpg' },
    { name: 'Nail Artists', image: 'servicesImgs/nails.png' },
    { name: 'Makeup artists', image: 'servicesImgs/makeup.png' },
    { name: 'Fitness', image: 'servicesImgs/fitness.png' },
    { name: 'Nutricionistas', image: 'servicesImgs/nutricionista.png' },
    { name: 'Tatuadores', image: 'servicesImgs/tattoo.png' },
    { name: 'Fisioterapeutas', image: 'servicesImgs/fisio.png' },
    { name: 'Consultas Médicas', image: 'servicesImgs/consulta.png' },
    { name: 'Terapeutas', image: 'servicesImgs/terapia.png' },
    { name: 'Depilação', image: 'servicesImgs/depilacao.png' },
  ];
}
