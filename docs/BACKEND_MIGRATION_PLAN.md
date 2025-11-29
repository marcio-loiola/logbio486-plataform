# Plano de Execução: Migração para Backend Python (FastAPI)

Este plano detalha os passos para preparar o ambiente frontend e orientar o desenvolvimento do backend em Python com FastAPI.

## 1. Estrutura Sugerida para o Backend

Recomendamos que o backend seja criado em um repositório separado ou em uma pasta `backend/` na raiz deste repositório (monorepo).

```
backend/
├── app/
│   ├── main.py            # Ponto de entrada (FastAPI app)
│   ├── api/
│   │   └── v1/
│   │       ├── endpoints/ # Rotas (fleet.py, predictions.py)
│   │       └── api.py     # Roteador principal
│   ├── core/
│   │   └── config.py      # Configurações (env vars)
│   ├── models/            # Modelos de banco de dados (SQLAlchemy/Pydantic)
│   ├── schemas/           # Schemas Pydantic (Request/Response)
│   └── services/          # Lógica de negócio (ML, cálculos)
├── requirements.txt
├── Dockerfile
└── docker-compose.yml
```

## 2. Configuração do Frontend

### Variáveis de Ambiente
Crie um arquivo `.env` na raiz do projeto frontend (`logbio486-plataform/`) para definir a URL da API.

```env
VITE_API_URL=http://localhost:8000/api/v1
```

### Atualização do Serviço de API (`src/services/api.ts`)
Substituir os dados mockados por chamadas reais utilizando `fetch` ou `axios`.

**Exemplo de implementação futura:**

```typescript
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1';

export const getFleetOverview = async (): Promise<FleetOverview> => {
  try {
    const response = await fetch(`${API_URL}/fleet/overview`);
    if (!response.ok) throw new Error('Falha ao buscar dados');
    return await response.json();
  } catch (error) {
    console.error(error);
    // Fallback para mock ou erro
    throw error;
  }
};

export const generateInsight = async (params: PredictionParams): Promise<PredictionResult> => {
  const response = await fetch(`${API_URL}/predictions/generate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params),
  });
  return await response.json();
};
```

## 3. Configuração do Backend (FastAPI)

### Instalação Básica
O desenvolvedor backend deve instalar as dependências essenciais:

```bash
pip install fastapi uvicorn pydantic
```

### Configuração de CORS
É **crucial** configurar o CORS no FastAPI para aceitar requisições do frontend (que roda na porta 8080).

```python
# app/main.py
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

origins = [
    "http://localhost:8080",
    "http://127.0.0.1:8080",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

## 4. Execução Integrada (Docker Compose)

Para facilitar o desenvolvimento, recomenda-se usar Docker Compose para subir ambos os serviços.

```yaml
version: '3.8'

services:
  frontend:
    build: ./logbio486-plataform
    ports:
      - "8080:8080"
    environment:
      - VITE_API_URL=http://localhost:8000/api/v1
    depends_on:
      - backend

  backend:
    build: ./backend
    ports:
      - "8000:8000"
    volumes:
      - ./backend/app:/app/app
```

## 5. Próximos Passos Imediatos

1.  **Backend**: Inicializar o projeto FastAPI e implementar o endpoint `/fleet/overview` retornando o JSON estático definido em `API_REQUIREMENTS.md`.
2.  **Frontend**: Criar a variável `VITE_API_URL` e testar a conexão com o endpoint de teste.
3.  **Integração**: Validar o fluxo completo de dados.
