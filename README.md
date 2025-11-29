# LogBio486 Platform

Este projeto é uma plataforma web desenvolvida com React, Vite e TypeScript, focada no gerenciamento de diários de bordo (Logbooks).

## 🚀 Visão Geral

A aplicação oferece uma interface moderna e responsiva, incluindo uma landing page informativa, sistema de autenticação e um dashboard para gerenciamento de registros.

### Principais Funcionalidades

- **Landing Page**: Apresentação do produto com seções de Solução, Como Funciona, Diferenciais e Depoimentos.
- **Autenticação**: Sistema de login e registro de usuários.
- **Dashboard**: Área restrita para gerenciamento de dados.
- **Logbook**: Funcionalidade principal para criar e listar registros de diário de bordo.
- **Responsividade**: Interface adaptável para diferentes tamanhos de tela.

## 🛠️ Tecnologias Utilizadas

- **Core**: React, Vite, TypeScript
- **Estilização**: Tailwind CSS, Shadcn UI
- **Gerenciamento de Estado**: Redux Toolkit
- **Backend / Dados**: Supabase, React Query
- **Roteamento**: React Router DOM
- **Formulários**: React Hook Form, Zod

## 📂 Estrutura do Projeto

### Pastas Principais (`src/`)

- **`pages/`**: Contém as páginas principais da aplicação (rotas).
  - `Index.tsx`: Landing page pública.
  - `Auth.tsx`: Página de autenticação (Login/Cadastro).
  - `Dashboard.tsx`: Painel principal do usuário.
  - `NotFound.tsx`: Página de erro 404.

- **`components/`**: Componentes reutilizáveis e seções da página.
  - **Landing Page**: `Hero`, `Solution`, `HowItWorks`, `Differentials`, `Testimonials`, `CTA`, `Footer`.
  - **Funcionalidades**: `LogbookForm` (formulário de registro), `LogbookList` (listagem).
  - **UI**: Componentes de interface genéricos (botões, inputs, cards) em `ui/`.

- **`store/`**: Gerenciamento de estado global com Redux.
  - `slices/authSlice.ts`: Estado de autenticação.
  - `slices/logbookSlice.ts`: Estado dos logbooks.

- **`lib/`**: Configurações e utilitários (ex: cliente do Supabase).

## 🚦 Guia de Execução

Siga os passos abaixo para rodar o projeto localmente:

### Pré-requisitos

- Node.js (versão 18 ou superior recomendada)
- npm ou yarn

### Instalação

1. Clone o repositório (se ainda não o fez):
   ```bash
   git clone <URL_DO_REPOSITORIO>
   ```

2. Instale as dependências:
   ```bash
   npm install
   ```

### Rodando o Projeto

Para iniciar o servidor de desenvolvimento:

```bash
npm run dev
```

O projeto estará acessível em `http://localhost:8080` (ou outra porta indicada no terminal).

### Scripts Disponíveis

- `npm run dev`: Inicia o servidor de desenvolvimento.
- `npm run build`: Gera a build de produção.
- `npm run lint`: Executa a verificação de código (linting).
- `npm run preview`: Visualiza a build de produção localmente.
