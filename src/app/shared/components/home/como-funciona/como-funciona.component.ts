import { Component } from '@angular/core';

export interface Passo {
  titulo: string;
  descricao: string;
  imagem: string;
  funcionalidades: string[];
}

@Component({
  selector: 'app-como-funciona',
  templateUrl: './como-funciona.component.html',
  styleUrl: './como-funciona.component.scss',
})
export class ComoFuncionaComponent {
  passos: Passo[] = [
    {
      titulo: 'Regista o teu negócio',
      descricao:
        'Cria a tua conta gratuitamente em poucos passos. Adiciona as informações essenciais do teu negócio, como o tipo de serviços, localização e contactos. Estás pronto a começar sem complicações!',
      imagem: 'regista_teu_negocio.png',
      funcionalidades: [
        'Registo gratuito e rápido',
        'Integração com Google Maps',
        'Perfis personalizados para negócios',
        'Confirmação automática por e-mail',
      ],
    },
    {
      titulo: 'Organiza a tua equipa',
      descricao:
        'Configura os horários de funcionamento, define os serviços disponíveis e atribui tarefas à tua equipa. Tens total controlo sobre a gestão do teu negócio num único painel intuitivo.',
      imagem: 'organiza_horarios.png',
      funcionalidades: [
        'Calendário interativo',
        'Gestão de equipa com permissões',
        'Criação e edição de serviços',
        'Disponibilidade em tempo real',
      ],
    },
    {
      titulo: 'Recebe marcações online',
      descricao:
        'Os teus clientes podem agendar serviços de forma prática e rápida através da plataforma. Recebe notificações em tempo real, acompanha o histórico e melhora a experiência do cliente com automatização.',
      imagem: 'clientes_Marcacao.png',
      funcionalidades: [
        'Agendamento online 24/7',
        'Notificações por e-mail e SMS',
        'Sistema de avaliação de serviços',
        'Gestão de cancelamentos e remarcações',
      ],
    },
  ];
}
