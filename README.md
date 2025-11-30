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

Para instruções detalhadas sobre como configurar e rodar o projeto utilizando **Bun**, consulte o arquivo [docs/RUNNING.md](docs/RUNNING.md).

### Quick Start

```bash
# Instalar dependências (Windows: use --ignore-scripts se falhar)
bun install --ignore-scripts

# Rodar servidor de desenvolvimento
bun run dev
```

*Se houver erro ao iniciar no Windows, use o comando direto:*
```powershell
bun node_modules/vite/bin/vite.js
```
