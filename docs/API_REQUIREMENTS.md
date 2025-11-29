# Requisitos da API - LogBio486

Este documento descreve os requisitos da API necessários para suportar o frontend da plataforma LogBio486. O backend deve ser desenvolvido utilizando **Python FastAPI**.

## Visão Geral

A API deve fornecer endpoints para:
1.  **Dashboard**: Dados gerais da frota, KPIs e histórico de performance.
2.  **Previsões**: Geração de insights de bioincrustação e consumo de combustível com base em parâmetros de entrada.
3.  **Autenticação**: (Futuro) Login e gerenciamento de sessão.

---

## Endpoints Necessários

### 1. Visão Geral da Frota (Dashboard)

Retorna os dados consolidados para o dashboard principal.

- **Método**: `GET`
- **Rota**: `/api/v1/fleet/overview`
- **Autenticação**: Necessária (Bearer Token)

#### Resposta de Sucesso (200 OK)

```json
{
  "totalShips": 45,
  "activeShips": 42,
  "averageEfficiency": 87.5,
  "kpis": [
    {
      "id": "1",
      "title": "Eficiência Média",
      "value": 87.5,
      "unit": "%",
      "trend": "up",
      "trendValue": "+2.1%",
      "status": "success"
    },
    {
      "id": "2",
      "title": "Risco de Bioincrustação",
      "value": "Baixo",
      "unit": "",
      "trend": "neutral",
      "trendValue": "Estável",
      "status": "info"
    }
    // ... outros KPIs
  ],
  "performanceHistory": [
    {
      "date": "2023-10-01",
      "value": 85.5,
      "type": "historical"
    }
    // ... histórico de 30 dias
  ]
}
```

### 2. Gerar Previsão e Insights

Calcula previsões de consumo e risco de bioincrustação com base nos parâmetros da viagem.

- **Método**: `POST`
- **Rota**: `/api/v1/predictions/generate`
- **Autenticação**: Necessária (Bearer Token)

#### Corpo da Requisição (JSON)

```json
{
  "shipId": "SHIP-123",
  "routeId": "ROUTE-RJ-SP",
  "speed": 14.5,
  "days": 15
}
```

| Campo | Tipo | Descrição |
|---|---|---|
| `shipId` | string | Identificador único do navio |
| `routeId` | string | Identificador da rota |
| `speed` | number | Velocidade média em nós |
| `days` | number | Duração da viagem em dias |

#### Resposta de Sucesso (200 OK)

```json
{
  "fuelConsumption": 4350,
  "biofoulingRisk": 32.5,
  "maintenanceDate": "2023-12-15",
  "chartData": [
    {
      "date": "2023-11-01",
      "value": 84.2,
      "type": "prediction"
    }
    // ... dados projetados para os dias solicitados
  ]
}
```

---

## Modelos de Dados (Schemas)

### KPIData
```python
class KPIData(BaseModel):
    id: str
    title: str
    value: Union[str, float]
    unit: str
    trend: Literal['up', 'down', 'neutral']
    trendValue: str
    status: Literal['success', 'warning', 'error', 'info']
```

### TimeSeriesPoint
```python
class TimeSeriesPoint(BaseModel):
    date: str  # ISO 8601 YYYY-MM-DD
    value: float
    type: Literal['historical', 'prediction']
```

### FleetOverview
```python
class FleetOverview(BaseModel):
    totalShips: int
    activeShips: int
    averageEfficiency: float
    kpis: List[KPIData]
    performanceHistory: List[TimeSeriesPoint]
```

### PredictionParams
```python
class PredictionParams(BaseModel):
    shipId: str
    routeId: str
    speed: float
    days: int
```

### PredictionResult
```python
class PredictionResult(BaseModel):
    fuelConsumption: float
    biofoulingRisk: float
    maintenanceDate: str
    chartData: List[TimeSeriesPoint]
```

## Considerações Técnicas

- **CORS**: A API deve permitir requisições da origem do frontend (ex: `http://localhost:8080`).
- **Formato de Data**: Utilizar ISO 8601 (`YYYY-MM-DD`) para datas.
- **Tratamento de Erros**: Retornar códigos HTTP apropriados (400 para validação, 401 para auth, 500 para erro interno) com mensagens descritivas.
