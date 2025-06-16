# 🔄 SISTEMA DE SINCRONIZAÇÃO BLUE CRM

## 🎯 **VISÃO GERAL**

Sistema completo de sincronização automática que:
- 📥 Baixa dados das APIs WBuy e Active Campaign
- 💾 Armazena no Supabase para acesso rápido
- 🔄 Sincroniza automaticamente a cada minuto
- 🚀 Garante zero downtime no sistema

---

## 🚀 **QUICK START**

### 1. **Configurar Ambiente**
```bash
# Copiar configurações (ver docs/ENV_EXAMPLE.md)
cp docs/ENV_EXAMPLE.md .env

# Instalar dependências
npm install
```

### 2. **Executar Pré-carga**
```bash
# Baixar todos os dados iniciais
npm run preload:bela-blue
```

### 3. **Iniciar Sistema**
```bash
# Rodar em desenvolvimento
npm run dev
```

### 4. **Ativar Sincronização**
- Acesse o painel de administração
- Vá para "Sincronização de Dados"
- Clique em "🚀 Iniciar Sincronização"

---

## 📁 **ESTRUTURA DO PROJETO**

```
src/
├── services/sync/
│   ├── DataSyncService.ts     # Serviço principal
│   └── AutoSyncService.ts     # Sincronização automática
├── scripts/
│   └── preload-data.ts        # Script de pré-carga
├── components/sync/
│   └── SyncControlPanel.tsx   # Interface de controle
└── docs/
    ├── PLANO_SYNC_COMPLETO.md # Documentação completa
    └── ENV_EXAMPLE.md         # Configurações de ambiente
```

---

## 🔧 **SCRIPTS DISPONÍVEIS**

| Script | Descrição |
|--------|-----------|
| `npm run dev` | Inicia desenvolvimento |
| `npm run preload:bela-blue` | Executa pré-carga completa |
| `npm run test:wbuy` | Testa conexão WBuy |
| `npm run sync:status` | Status da sincronização |
| `npm run sync:logs` | Logs de sincronização |

---

## 📊 **DADOS SINCRONIZADOS**

### **WBuy API (12 endpoints)**
- ✅ Clientes
- ✅ Produtos  
- ✅ Pedidos
- ✅ Afiliados
- ✅ Categorias
- ✅ Campanhas
- ✅ Envios
- ✅ Financeiro
- ✅ Estoque
- ✅ Vendedores
- ✅ Cupons
- ✅ Relatórios

### **Active Campaign API (12 endpoints)**
- ✅ Contacts
- ✅ Lists
- ✅ Campaigns
- ✅ Automations
- ✅ Deals
- ✅ Accounts
- ✅ Tags
- ✅ Custom Fields
- ✅ Forms
- ✅ Segments
- ✅ Messages
- ✅ Notes

---

## 🎛️ **PAINEL DE CONTROLE**

### **Funcionalidades**
- 🟢/🔴 Status da sincronização (Ativa/Parada)
- ⏰ Próxima execução programada
- 📊 Estatísticas por tenant e tipo de dados
- 🔄 Controles para iniciar/parar sincronização
- 📥 Botão para executar pré-carga manual

### **Como Usar**
```typescript
import SyncControlPanel from '@/components/sync/SyncControlPanel';

// Em uma página de admin
<SyncControlPanel />
```

---

## 🔄 **FLUXO DE SINCRONIZAÇÃO**

### **Pré-carga (Executar UMA vez)**
1. 🧹 Limpa dados antigos
2. 📥 Baixa TODOS os dados das APIs
3. 💾 Salva no Supabase em lotes
4. ✅ Marca como dados válidos
5. 🎉 Sistema pronto para uso

### **Sincronização Automática (A cada minuto)**
1. ⏰ Timer dispara automaticamente
2. 🔄 Atualiza dados de todos os endpoints
3. 📊 Registra logs e estatísticas
4. ⏱️ Aguarda próximo ciclo

---

## 💾 **BANCO DE DADOS**

### **Tabela: api_data**
```sql
CREATE TABLE api_data (
  id BIGSERIAL PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  api_source TEXT NOT NULL, -- 'wbuy' ou 'activecampaign'
  data_type TEXT NOT NULL,  -- 'clientes', 'produtos', etc
  external_id TEXT,
  data JSONB NOT NULL,
  last_sync TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

### **Tabela: tenants**
```sql
CREATE TABLE tenants (
  tenant_id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  is_active BOOLEAN DEFAULT true,
  data_preloaded BOOLEAN DEFAULT false,
  last_preload TIMESTAMPTZ,
  last_sync TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

---

## 🔌 **COMO USAR OS DADOS**

### **Buscar Dados Sincronizados**
```typescript
import { DataSyncService } from '@/services/sync/DataSyncService';

const syncService = new DataSyncService();

// Buscar clientes da Bela Blue
const clientes = await syncService.getHistoricalData(
  'bela_blue',
  'wbuy', 
  'clientes',
  100 // limite
);

// Buscar contatos do Active Campaign
const contatos = await syncService.getHistoricalData(
  'bela_blue',
  'activecampaign',
  'contacts'
);
```

### **Controlar Sincronização**
```typescript
import { globalAutoSync } from '@/services/sync/AutoSyncService';

// Iniciar sincronização
globalAutoSync.start();

// Parar sincronização
globalAutoSync.stop();

// Ver status
const status = globalAutoSync.getStatus();
console.log('Ativa:', status.isRunning);
console.log('Próxima execução:', status.nextRun);
```

---

## 🏢 **MULTI-TENANT**

### **Adicionar Novo Cliente**
1. Adicionar credenciais no `.env`
2. Atualizar `AutoSyncService.ts`:

```typescript
const config: AutoSyncConfig = {
  intervalMinutes: 1,
  tenants: [
    {
      tenantId: 'bela_blue',
      // ... configurações Bela Blue
    },
    {
      tenantId: 'novo_cliente',
      wbuyConfig: {
        url: process.env.VITE_NOVO_CLIENTE_WBUY_URL,
        token: process.env.VITE_NOVO_CLIENTE_WBUY_TOKEN,
        storeId: process.env.VITE_NOVO_CLIENTE_WBUY_STORE_ID
      }
    }
  ]
};
```

---

## ⚡ **PERFORMANCE**

### **Otimizações Implementadas**
- 🔄 Inserção em lotes (50 registros por vez)
- ⏱️ Delay entre requests (1 segundo)
- 📦 Cache local para fallback
- 🎯 Queries otimizadas no Supabase
- 🔧 Indexes nas tabelas principais

### **Monitoramento**
- 📊 Estatísticas em tempo real
- 📝 Logs detalhados de cada operação
- ⚠️ Alertas de erro automáticos
- 📈 Métricas de performance

---

## 🆘 **TROUBLESHOOTING**

### **Problemas Comuns**

| Problema | Solução |
|----------|---------|
| Erro de autenticação | Verificar tokens no `.env` |
| Timeout Supabase | Reduzir `SYNC_BATCH_SIZE` |
| Rate limit APIs | Aumentar `SYNC_REQUEST_DELAY_MS` |
| Dados inconsistentes | Executar nova pré-carga |

### **Comandos de Debug**
```bash
# Ver logs detalhados
npm run sync:logs

# Testar APIs individualmente  
npm run test:wbuy

# Verificar status
npm run sync:status

# Reinstalar dependências
npm install
```

---

## 🔒 **SEGURANÇA**

- ✅ Tokens de API em variáveis de ambiente
- ✅ Validação de dados antes da inserção
- ✅ Rate limiting para evitar sobrecarga
- ✅ Logs de auditoria completos
- ✅ Backup automático no Supabase

---

## 🎯 **ROADMAP**

### **Próximas Melhorias**
- [ ] 📧 Notificações por email em erro
- [ ] 📱 App mobile para monitoramento
- [ ] 🔄 Sincronização diferencial (delta)
- [ ] 📊 Dashboard com gráficos
- [ ] 🤖 IA para detecção de anomalias

---

## 📞 **SUPORTE**

- 📖 **Documentação**: `docs/PLANO_SYNC_COMPLETO.md`
- 🔧 **Configuração**: `docs/ENV_EXAMPLE.md`
- 🏗️ **Arquitetura**: `docs/ARQUITETURA_WHITE_LABEL.md`

---

**🎉 SISTEMA ROBUSTO E ESCALÁVEL! 🎉**

*O Blue CRM agora possui um sistema de sincronização profissional que garante dados sempre atualizados sem comprometer a performance.* 