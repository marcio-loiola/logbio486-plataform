# Guia de Execução com Bun (Windows/Troubleshooting)

Este projeto utiliza **Bun** como runtime e gerenciador de pacotes. Devido a algumas particularidades de permissão no Windows (especificamente com o pacote `esbuild`), siga as instruções abaixo para garantir uma execução sem erros.

## 1. Instalação do Bun

Se você ainda não tem o Bun instalado:

```powershell
powershell -c "irm bun.sh/install.ps1 | iex"
```

*Após a instalação, reinicie seu terminal ou VS Code para que o comando `bun` seja reconhecido.*

## 2. Instalação de Dependências

Para evitar erros nos scripts de pós-instalação (comum no Windows), utilize a flag `--ignore-scripts`:

```bash
bun install --ignore-scripts
```

> **Nota**: Se você rodar apenas `bun install` e receber erro "exit code 3" no `esbuild`, apague a pasta `node_modules` e tente novamente com o comando acima.

## 3. Rodando o Projeto (Servidor de Desenvolvimento)

O comando padrão é:

```bash
bun run dev
```

### ⚠️ Solução de Problemas (Windows)

Se o comando acima falhar (geralmente silenciosamente ou com erro de script), execute o binário do Vite diretamente através do Bun. Isso contorna as verificações estritas de script do package.json:

```powershell
bun node_modules/vite/bin/vite.js
```

O servidor deverá iniciar normalmente em `http://localhost:8080/`.

## 4. Outros Comandos Úteis

*   **Build de Produção**: `bun run build`
*   **Linting**: `bun run lint`
*   **Preview**: `bun run preview`
