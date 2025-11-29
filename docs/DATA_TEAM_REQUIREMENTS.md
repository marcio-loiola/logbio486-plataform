# Guia de Requisitos para Equipe de Dados

Este documento orienta a equipe de dados sobre os objetivos, fontes de dados e modelos analíticos necessários para o sistema **LogBio486**.

## 1. Objetivos da Análise de Dados

O objetivo central é transformar o **LogBio486** de um sistema de registro passivo para uma plataforma de **Gerenciamento Inteligente de Bioincrustação**.

Os modelos de dados devem responder:
1.  **Qual o impacto atual da bioincrustação no consumo de combustível?** (Quantificação de Custo)
2.  **Qual o risco de bioincrustação para uma rota/navio específico?** (Previsão de Risco)
3.  **Quando deve ser feita a próxima manutenção (limpeza do casco)?** (Manutenção Preditiva)

## 2. Fontes de Dados Disponíveis

Atualmente, o sistema coleta os seguintes dados via formulário (`LogbookForm`):

| Campo | Tipo | Descrição | Importância para Modelagem |
|---|---|---|---|
| `vessel_name` | String | Identificador do navio | Agrupamento de séries temporais |
| `entry_date` | Date | Data do registro | Eixo temporal |
| `velocity` | Float | Velocidade média (nós) | Variável chave para consumo |
| `fuel_consumption` | Float | Consumo (L/MT ou ton/dia) | Variável alvo (Target) |
| `route` | String | Rota (Origem -> Destino) | Contexto geográfico |
| `water_temperature` | Float | Temperatura da água (°C) | Fator de crescimento biológico |
| `salinity` | Float | Salinidade (PSU) | Fator de crescimento biológico |
| `biofouling_level` | Categórico | None, Light, Moderate, Heavy | Label (Rótulo) para classificação |

### Dados Faltantes (Recomendação de Coleta)
Para modelos robustos, recomendamos solicitar ao time de desenvolvimento a inclusão de:
- **Data da Última Limpeza**: Essencial para calcular a "idade" da incrustação.
- **Tipo de Tinta/Revestimento**: Afeta a taxa de crescimento.
- **Imagens do Casco**: Para futuro treinamento de Visão Computacional.

## 3. Modelos Analíticos Necessários

### A. Modelo de Desempenho (Regressão)
Estimar o consumo de combustível "ideal" vs "real".

*   **Target**: `fuel_consumption`
*   **Features**: `velocity`, `distance`, `draft` (calado - se houver), `weather_conditions`.
*   **Output**: A diferença entre o consumo previsto (casco limpo) e o real é o "Custo da Bioincrustação".

### B. Modelo de Risco de Bioincrustação (Classificação/Regressão)
Prever o nível de incrustação baseado nas condições operacionais.

*   **Target**: `biofouling_level` (ou um score de 0-100)
*   **Features**: `water_temperature`, `salinity`, `days_since_cleaning`, `idle_days` (dias parado).
*   **Lógica**: Águas quentes e paradas aceleram o crescimento. O modelo deve alertar navios em risco.

### C. Otimizador de Manutenção
Determinar o ponto ótimo econômico para limpeza.

*   **Input**: Custo da limpeza vs Custo extra de combustível acumulado.
*   **Output**: Data sugerida para manutenção.

## 4. Plano de Ação Imediato

1.  **Análise Exploratória (EDA)**:
    *   Verificar correlação entre `biofouling_level` informado e `fuel_consumption`.
    *   Identificar rotas com maior incidência de "Heavy" fouling.
2.  **Validação de Dados**:
    *   Comparar `water_temperature` informado com dados de satélite (ex: Copernicus/NOAA) para validar a qualidade dos inputs manuais.
3.  **Prototipagem**:
    *   Criar um script Python simples que receba JSON (conforme `API_REQUIREMENTS.md`) e retorne uma previsão baseada em regras (heurística) enquanto o modelo de ML não tem histórico suficiente.
