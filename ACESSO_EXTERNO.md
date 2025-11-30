# Acesso Externo - Configuração

## Frontend (React/Vite)

O frontend já está configurado para aceitar conexões externas. Ao iniciar o servidor com `npm run dev`, ele estará acessível em:

- **Local**: `http://localhost:8080`
- **Rede Local**: `http://[SEU_IP]:8080` (ex: `http://192.168.1.100:8080`)

### Descobrir seu IP

**Windows:**
```powershell
ipconfig
```
Procure por "IPv4 Address" na interface de rede ativa.

**Linux/Mac:**
```bash
ip addr show
# ou
ifconfig
```

## Backend (Python/FastAPI)

O backend já está configurado para aceitar conexões externas (`HOST: 0.0.0.0`).

### Iniciar o Backend

```bash
cd C:\Users\Maikon\Desktop\modelo-transpetro-v2\modelo-transpetro-v2
python run_api.py
```

O backend estará acessível em:
- **Local**: `http://localhost:8000`
- **Rede Local**: `http://[SEU_IP]:8000`

## Configuração do Proxy

O proxy do Vite está configurado para redirecionar `/api` para `http://localhost:8000`. 

**Importante**: Quando acessar externamente, o proxy ainda funciona porque ele roda no servidor onde o Vite está executando. Se o backend estiver em outro servidor, você precisará:

1. Criar um arquivo `.env` na raiz do projeto frontend:
```env
VITE_API_TARGET=http://[IP_DO_BACKEND]:8000
```

2. Ou ajustar manualmente o `vite.config.ts` para apontar para o IP correto do backend.

## Firewall

Certifique-se de que as portas estão abertas no firewall:

**Windows:**
```powershell
# Permitir porta 8080 (Frontend)
New-NetFirewallRule -DisplayName "Frontend Port 8080" -Direction Inbound -LocalPort 8080 -Protocol TCP -Action Allow

# Permitir porta 8000 (Backend)
New-NetFirewallRule -DisplayName "Backend Port 8000" -Direction Inbound -LocalPort 8000 -Protocol TCP -Action Allow
```

**Linux:**
```bash
# Ubuntu/Debian
sudo ufw allow 8080/tcp
sudo ufw allow 8000/tcp
```

## Acesso de Outros Dispositivos

1. Certifique-se de que o frontend e backend estão rodando
2. Descubra o IP do seu computador na rede local
3. Em outro dispositivo na mesma rede, acesse: `http://[IP_DO_COMPUTADOR]:8080`

## Troubleshooting

### Não consegue acessar externamente

1. Verifique se o firewall está bloqueando as portas
2. Certifique-se de que está na mesma rede (WiFi/LAN)
3. Verifique se os serviços estão rodando corretamente
4. Tente acessar pelo IP em vez de localhost

### Erro de CORS

O backend já está configurado com CORS permitindo todas as origens (`CORS_ORIGINS: ["*"]`). Se ainda houver problemas, verifique a configuração em `api/config.py`.

### Proxy não funciona

Se o proxy não estiver funcionando ao acessar externamente, você pode:
1. Configurar o backend para aceitar requisições diretas
2. Ou usar uma variável de ambiente para configurar o target do proxy

