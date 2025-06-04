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
  selector: 'app-home', // Seletor do componente
  templateUrl: './home.component.html', // Template associado ao componente
  styleUrls: ['./home.component.scss'], // Estilos associados ao componente
  animations: [
    // Define as animações usadas no componente
    trigger('slideInOut', [
      // Animação para entrada e saída de elementos
      transition(':enter', [
        // Animação ao entrar
        style({ transform: 'translateX(100%)', opacity: 0 }), // Começa fora da tela à direita
        animate(
          '600ms ease-out',
          style({ transform: 'translateX(0)', opacity: 1 }) // Move para a posição inicial com opacidade total
        ),
      ]),
      transition(':leave', [
        // Animação ao sair
        animate(
          '600ms ease-in',
          style({ transform: 'translateX(-100%)', opacity: 0 }) // Sai para a esquerda com opacidade zero
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
    // Configura um intervalo para alternar entre as frases
    setInterval(() => {
      this.animationState = false; // Desativa a animação
      setTimeout(() => {
        this.fraseAtual = (this.fraseAtual + 1) % this.frases.length; // Alterna para a próxima frase
        this.animationState = true; // Reativa a animação
      }, 600); // Tempo para a animação de saída
    }, 4000); // Intervalo entre as trocas de frases
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
      this.router.navigate(['/businesses'], {
        queryParams: { name: this.searchQuery },
      });
    }
  }
}
