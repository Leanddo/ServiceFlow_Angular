# ServiceFlow Angular

Este projeto é a aplicacão web do ServiceFlow, uma plataforma para gestão de serviços, negócios e agendamentos online.

## Funcionalidades

- Cadastro e login de usuários (incluindo autenticação por Google e OTP)
- Cadastro e gestão de negócios (barbearias, salões, clínicas, etc.)
- Gestão de profissionais e permissões por negócio
- Cadastro e edição de serviços oferecidos
- Upload e gestão de fotos do negócio e dos serviços
- Sistema de avaliações e reviews
- Dashboard para profissionais e donos de negócio
- Agendamento online de serviços
- Responsivo e otimizado para mobile

## Tecnologias Utilizadas

- [Angular](https://angular.io/) 18+
- RxJS
- Angular Router
- Angular Forms (Template e Reactive)
- SCSS
- Consumo de API RESTful

## Como rodar o projeto

### Pré-requisitos

- Node.js (v18 ou superior)
- Angular CLI (`npm install -g @angular/cli`)

### Instalação

1. Clone o repositório:
   ```bash
   git clone https://github.com/Leanddo/ServiceFlow_Angular.git
   cd ServiceFlow_Angular
   ```

2. Instale as dependências:
   ```bash
   npm install
   ```

3. Configure as variáveis de ambiente se necessário (ex: `src/environments/environment.ts`).

### Rodando o servidor de desenvolvimento

```bash
ng serve
```

Acesse [http://localhost:4200](http://localhost:4200) no navegador.

### Build para produção

```bash
ng build
```


## Estrutura de Pastas

```
src/
  app/
    pages/           # Páginas principais (home, dashboard, auth, etc.)
    shared/          # Componentes compartilhados (navbar, footer, forms, etc.)
    services/        # Serviços Angular para API e lógica de negócio
    model/           # Interfaces e tipos TypeScript
    guards/          # Guards de rota (auth, owner, etc.)
    config/          # Configurações de endpoints e variáveis globais
  assets/            # Imagens, ícones e arquivos estáticos
```
