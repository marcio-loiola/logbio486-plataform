# Plano de Desenvolvimento Colaborativo do Backend (Modo Hackathon)

Este documento define uma estratégia **simplificada e ágil** para dois desenvolvedores trabalharem simultaneamente no backend durante o hackathon. O foco é **velocidade de entrega** e **integração rápida**, eliminando complexidades de infraestrutura como Docker.

## 1. Estrutura Simplificada e Git Workflow

Trabalharemos diretamente na máquina local usando ambientes virtuais Python.

### Estrutura de Diretórios
```
/ (root)
├── backend/ (Novo - Python/FastAPI)
│   ├── app/
│   │   ├── api/           # Endpoints
│   │   ├── models/        # Banco de Dados (SQLite)
│   │   ├── schemas/       # Contratos de Dados (Pydantic)
│   │   ├── services/      # Lógica de Negócio
│   │   └── main.py        # App principal
│   ├── requirements.txt
│   └── venv/ (Ignorado no git)
├── src/ (Frontend existente)
└── docs/
```

### Estrutura de Branches (Simples)
*   `main`: Código funcional.
*   `backend-dev`: Branch compartilhada para o backend (para evitar excesso de PRs no hackathon).
    *   *Dica*: Se estiverem sentados lado a lado, comitem direto na `backend-dev` e façam `git pull` frequentes. Se houver conflito, resolvam na hora.

---

## 2. Divisão de Responsabilidades (Paralelismo Real)

### Desenvolvedor A: "O Dono dos Dados" (Core & API)
**Missão**: Garantir que o Frontend consiga salvar e ler dados imediatamente.
**Foco Técnico**: FastAPI, SQLAlchemy, SQLite, Pydantic.

### Desenvolvedor B: "O Cientista de Dados" (Lógica & Valor)
**Missão**: Transformar dados brutos em métricas bonitas para o Dashboard.
**Foco Técnico**: Algoritmos, Regras de Negócio, Manipulação de JSON, Estatística.

---

## 3. Como Rodar (Sem Docker)

Cada desenvolvedor precisará de **dois terminais** abertos.

### Terminal 1: Backend (Python)
```bash
cd backend
# Criar e ativar ambiente virtual (apenas na 1ª vez)
python -m venv venv
# Windows:
.\venv\Scripts\activate
# Linux/Mac:
source venv/bin/activate

# Instalar dependências
pip install -r requirements.txt

# Rodar servidor (Recarrega automático ao salvar)
uvicorn app.main:app --reload --port 8000
```

### Terminal 2: Frontend (Node/Vite)
```bash
# Na raiz do projeto
npm run dev
```
*O Frontend rodará na porta 8080 (ou similar) e chamará o Backend na 8000.*

---

## 4. Contrato de API (O Mínimo Viável)

Para não perder tempo discutindo JSON, sigam este padrão simples:

### Entidades Principais
*   **Ship**: `{ id, name, type, last_cleaning_date, coating_type }`
*   **Logbook**: `{ id, ship_id, date, biofouling_level, image_url, idle_days, fuel_consumption, velocity, water_temp, salinity }`

### Endpoints Prioritários
1.  `GET /api/ships` -> Lista para o dropdown do formulário.
2.  `POST /api/logbooks` -> Salva o formulário do app.
3.  `GET /api/dashboard` -> Retorna o JSON pronto com todos os totais e riscos para a tela inicial. **(Tarefa do Dev B)**

---

## 5. Ciclos de Desenvolvimento Detalhados (Sprints de 45 min)

Para maximizar a produtividade, dividimos o trabalho em 5 ciclos curtos.

### Ciclo 1: Fundação e Hello World (45 min)
**Objetivo**: Ter o backend rodando e respondendo ao frontend.

*   **Dev A (Infra)**:
    *   [ ] Criar pasta `backend` e `venv`.
    *   [ ] Criar `requirements.txt` (`fastapi`, `uvicorn`, `sqlalchemy`, `pydantic`).
    *   [ ] Criar `app/main.py` com `FastAPI()` e **CORS** configurado para `localhost:8080`.
    *   [ ] Criar rota de teste `GET /health` retornando `{"status": "ok"}`.
*   **Dev B (Lógica)**:
    *   [ ] Criar `app/services/calculations.py`.
    *   [ ] Implementar função `calculate_risk(temp, idle_days)` com lógica "mockada" ou simples.
    *   [ ] Implementar função `calculate_roi(fuel_consumption, fuel_price)` retornando valor fixo por enquanto.
*   **Integração**:
    *   Frontend chama `http://localhost:8000/health` e recebe 200 OK.

### Ciclo 2: Modelagem de Dados (45 min)
**Objetivo**: Estruturar o banco de dados e os contratos de API.

*   **Dev A (Banco)**:
    *   [ ] Configurar `app/database.py` (Conexão SQLite).
    *   [ ] Criar `app/models/ship.py` e `app/models/logbook.py` (SQLAlchemy).
    *   [ ] Criar script `init_db.py` para criar as tabelas no arquivo `app.db`.
*   **Dev B (Schemas)**:
    *   [ ] Criar `app/schemas/ship.py` e `app/schemas/logbook.py` (Pydantic).
    *   [ ] Definir validações (ex: `biofouling_level` deve ser enum).
    *   [ ] Garantir que os schemas batem com o "Contrato de API" definido acima.
*   **Integração**:
    *   Rodar `init_db.py` e verificar se o arquivo `app.db` foi criado com sucesso.

### Ciclo 3: Escrita de Dados - O Fluxo de Entrada (45 min)
**Objetivo**: O formulário do frontend deve salvar dados reais no backend.

*   **Dev A (API Write)**:
    *   [ ] Criar endpoint `POST /api/logbooks`.
    *   [ ] Receber o JSON do frontend, validar com Pydantic e salvar no SQLite.
    *   [ ] Retornar ID do logbook criado.
*   **Dev B (Seed)**:
    *   [ ] Criar script `seed_data.py` para popular a tabela `Ships` com 3 ou 4 navios de exemplo.
    *   [ ] Isso é necessário para o dropdown do formulário funcionar.
*   **Integração**:
    *   Preencher o formulário no Frontend e verificar se o registro apareceu no banco (usar DBeaver ou extensão do VSCode para ver o SQLite).

### Ciclo 4: Leitura e Inteligência - O Fluxo de Saída (45 min)
**Objetivo**: O Dashboard deve mostrar dados processados e inteligentes.

*   **Dev A (API Read)**:
    *   [ ] Criar endpoint `GET /api/ships` (para o dropdown).
    *   [ ] Criar endpoint `GET /api/logbooks` (histórico).
*   **Dev B (API Analytics)**:
    *   [ ] Criar endpoint `GET /api/dashboard`.
    *   [ ] **A Mágica**: Dentro deste endpoint, buscar os últimos logbooks no DB, passar pelas funções de `calculations.py` (Ciclo 1) e montar o JSON de resposta.
    *   [ ] Calcular média de risco da frota.
*   **Integração**:
    *   Carregar a Home do Frontend e ver os gráficos se mexerem com dados vindos do backend.

### Ciclo 5: Polimento e Demo (30 min)
**Objetivo**: Deixar bonito para a apresentação.

*   **Dev A**:
    *   [ ] Adicionar tratamento de erro (Try/Catch) para não quebrar na demo.
    *   [ ] Adicionar logs (`print`) coloridos para mostrar no terminal durante a apresentação.
*   **Dev B**:
    *   [ ] Ajustar a "Heurística" para garantir que casos extremos (ex: 30 dias parado) gerem alertas visuais claros (Risco "CRÍTICO").
    *   [ ] Garantir que os valores monetários (ROI) façam sentido (nem centavos, nem bilhões).

---

## 6. Estratégia: Engenharia vs Ciência de Dados (Desbloqueio)

Como o time de dados ainda está modelando, não podemos esperar os modelos finais (ML).
**Solução: Abordagem "Heurística Primeiro"**

1.  **Contrato de Interface Fixo**:
    *   Definam a assinatura da função e não mudem mais.
    *   Ex: `def predict_risk(temp: float, idle_days: int) -> float:`
2.  **Implementação V0 (Regra de Bolo)**:
    *   O **Dev B** implementa uma lógica simples baseada em regras de negócio conhecidas (física básica).
    *   *Exemplo*: "Se temperatura > 25°C e dias parado > 5, Risco = 90%".
    *   Isso permite que o Frontend e o Backend fiquem prontos e funcionais.
3.  **Troca Transparente (V1)**:
    *   Quando o time de dados entregar o modelo `.pkl` ou a fórmula complexa, basta substituir o *miolo* da função `predict_risk`. O resto do sistema nem percebe.
4.  **Prioridade na Coleta**:
    *   O trabalho do **Dev A** é o mais crítico agora: garantir que os dados estão sendo salvos. Sem dados salvos, o time de dados não terá insumo para calibrar os modelos futuros.

## 7. Plano de Contingência: "Ninguém sabe Dados" (Plano C)

Se nenhum dos desenvolvedores tiver conhecimento em Ciência de Dados ou Estatística, não travem. Usem a **Abordagem Narrativa**:

1. **Lógica de "Videogame" (If/Else)**:
    *   Não tentem criar fórmulas matemáticas complexas. Pensem como num jogo de RPG.
    *   *Regra*: Cada dia parado adiciona +5 de XP no "Monstro da Bioincrustação".
    *   *Código*: `risco = min(100, dias_parado * 5 + temperatura_agua)`. Simples e eficaz para a demo.

2. **Simulação Visual (Randomização)**:
    *   Para o Dashboard não ficar estático, adicionem uma pequena variação aleatória nos dados históricos.
    *   Isso dá a impressão de "leitura de sensores em tempo real" sem precisar de sensores reais.

3. **O "Mágico de Oz" (LLM via API)**:
    *   Em vez de calcular, perguntem para uma IA.
    *   Criem uma função que manda o JSON do navio para a API da OpenAI ou Gemini com o prompt: *"Com base nestes dados, qual o risco de bioincrustação (0-100) e o prejuízo estimado?"*.
    *   Parseiem a resposta e mostrem no front. É impressionante e fácil de implementar.

## Dica de Ouro para Hackathon
Não percam tempo com validações complexas ou autenticação (Login) se não for requisito obrigatório do júri. Foquem em **mostrar o fluxo**:
*   Usuário preenche Logbook -> Dashboard atualiza o Risco -> Mostra $$ economizado.
