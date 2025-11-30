# 🚀 Como Rodar o Projeto Completo

## ✅ Status: Backend e Frontend Rodando!

## 📋 Comandos para Rodar

### 1. Backend (Terminal 1)

```bash
cd "C:\Users\Maikon\Desktop\modelo-transpetro-v2\modelo-transpetro-v2"
python run_api.py
```

**Aguarde**: A API deve iniciar e mostrar:
```
🚀 Starting Biofouling Prediction API
📍 URL: http://0.0.0.0:8000
📚 Docs: http://0.0.0.0:8000/docs
```

### 2. Frontend (Terminal 2)

```bash
cd "C:\Users\Maikon\Desktop\logbio486-plataform\logbio486-plataform"
npm run dev
```

**Aguarde**: O frontend deve iniciar e mostrar:
```
  VITE v5.x.x  ready in xxx ms

  ➜  Local:   http://localhost:8080/
  ➜  Network: use --host to expose
```

## 🌐 URLs de Acesso

### Backend
- **API**: http://localhost:8000
- **Documentação Swagger**: http://localhost:8000/docs
- **Health Check**: http://localhost:8000/health

### Frontend
- **Aplicação**: http://localhost:8080
- **Dashboard**: http://localhost:8080/dashboard
- **Integrações**: http://localhost:8080/integrations
- **Recomendações**: http://localhost:8080/cleaning-recommendations

## ✅ Verificação Rápida

### Backend está funcionando?
```bash
curl http://localhost:8000/health
```

Deve retornar: `{"status":"ok"}` ou `{"status":"healthy"}`

### Frontend está funcionando?
Abra no navegador: http://localhost:8080

## 🔄 Parar os Servidores

### Backend
No terminal do backend, pressione: `Ctrl + C`

### Frontend
No terminal do frontend, pressione: `Ctrl + C`

## 🐛 Problemas Comuns

### Backend não inicia
- Verifique se a porta 8000 está livre
- Verifique se todas as dependências estão instaladas: `pip install -r requirements.txt`
- Verifique se está na branch correta: `git checkout feat/external-api`

### Frontend não inicia
- Verifique se a porta 8080 está livre
- Instale dependências: `npm install`
- Limpe cache: `rm -rf node_modules .vite && npm install`

### Erro de conexão
- Verifique se o backend está rodando antes do frontend
- Verifique o proxy no `vite.config.ts`
- Verifique CORS no backend

## 📊 Status Atual

✅ **Backend**: Rodando em background  
✅ **Frontend**: Rodando em background

---

**Projeto completo rodando!** 🎉

