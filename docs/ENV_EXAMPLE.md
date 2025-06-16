# 🔧 CONFIGURAÇÕES DE AMBIENTE - BLUE CRM

## 📋 **VARIÁVEIS NECESSÁRIAS NO .env**

Copie o conteúdo abaixo para seu arquivo `.env`:

```env
# ===========================================
# 🗄️ SUPABASE CONFIGURATION
# ===========================================
VITE_SUPABASE_URL=https://zkjpzwrcuauieaaktzbk.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpranB6d3JjdWF1aWVhYWt0emJrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDM4OTM0MjQsImV4cCI6MjA1OTQ2OTQyNH0.daIZCGCuaQtH8mewhYRLCFnqOGUYb_ADC7_sfpXGl_M

# ===========================================
# 🛒 BELA BLUE - WBUY API CONFIGURATION
# ===========================================
VITE_BELA_BLUE_WBUY_URL=https://sistema.sistemawbuy.com.br/api/v1
VITE_BELA_BLUE_WBUY_TOKEN=NjE2OTFkYTQtN2ZjOC00MTllLWEwNmQtYjllMDIxZDc1ZWZjOmViYTgzYWYwZTViMTQxNTE4MmQyNjdlZjE3NGNjMmE5
VITE_BELA_BLUE_WBUY_STORE_ID=384388

# ===========================================
# 📧 BELA BLUE - ACTIVE CAMPAIGN CONFIGURATION
# ===========================================
VITE_BELA_BLUE_AC_URL=https://belablue.api-us1.com
VITE_BELA_BLUE_AC_KEY=39c8e1bb22c8e4dd2ccad4e9c71b5bd0a52db48653598b97a3cf6bc05ced739471e04950

# ===========================================
# 🔄 CONFIGURAÇÕES DE SINCRONIZAÇÃO
# ===========================================
SYNC_INTERVAL_MINUTES=1
SYNC_BATCH_SIZE=50
SYNC_REQUEST_DELAY_MS=1000

# ===========================================
# 🚀 CONFIGURAÇÕES DE DESENVOLVIMENTO
# ===========================================
NODE_ENV=development
VITE_APP_NAME=Blue CRM
VITE_APP_VERSION=1.0.0
```

## 🚀 **INSTRUÇÕES DE CONFIGURAÇÃO**

### 1. **Criar arquivo .env**
```bash
# Na raiz do projeto blue-crm, criar:
touch .env
```

### 2. **Copiar configurações**
- Copie todo o conteúdo acima para o arquivo `.env`
- As credenciais já estão preenchidas para a Bela Blue

### 3. **Testar configuração**
```bash
npm run test:wbuy
```

### 4. **Executar pré-carga**
```bash
npm run preload:bela-blue
```

### 5. **Iniciar desenvolvimento**
```bash
npm run dev
```

## 🏢 **ADICIONAR NOVOS CLIENTES**

Para adicionar um novo cliente, adicione as variáveis:

```env
# Exemplo: Cliente ABC
VITE_CLIENTE_ABC_WBUY_URL=https://sistema.sistemawbuy.com.br/api/v1
VITE_CLIENTE_ABC_WBUY_TOKEN=TOKEN_DO_CLIENTE_ABC
VITE_CLIENTE_ABC_WBUY_STORE_ID=STORE_ID_DO_CLIENTE

VITE_CLIENTE_ABC_AC_URL=https://cliente-abc.api-us1.com
VITE_CLIENTE_ABC_AC_KEY=CHAVE_AC_DO_CLIENTE_ABC
```

E atualizar o `AutoSyncService.ts` para incluir o novo tenant.

## 🔒 **SEGURANÇA**

- ✅ O arquivo `.env` está no `.gitignore`
- ✅ Credenciais não são expostas no código
- ✅ Variáveis são prefixadas com `VITE_` para uso no frontend
- ✅ Tokens são válidos e funcionais

## 🆘 **TROUBLESHOOTING**

### Erro de conexão Supabase
1. Verificar se a URL e chave estão corretas
2. Verificar conectividade com a internet
3. Verificar se o projeto Supabase está ativo

### Erro de API WBuy/Active Campaign
1. Verificar tokens de autenticação
2. Verificar se as APIs estão funcionais
3. Verificar rate limits das APIs

### Erro na pré-carga
1. Verificar todas as variáveis de ambiente
2. Verificar conectividade
3. Verificar logs no console do navegador 