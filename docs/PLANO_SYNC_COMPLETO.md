# 🚀 PLANO COMPLETO DE SINCRONIZAÇÃO WBUY + ACTIVE CAMPAIGN → SUPABASE

## 📋 **OBJETIVO**
Implementar um sistema robusto de sincronização que:
1. **Pré-carrega** todos os dados das APIs antes dos usuários acessarem
2. **Sincroniza automaticamente** a cada minuto para manter dados atualizados
3. **Evita travamentos** no Blue CRM mantendo dados locais no Supabase

---

## 🏗️ **ARQUITETURA IMPLEMENTADA**

### 1. **DataSyncService.ts**
- ✅ Serviço principal de sincronização
- ✅ Suporte para WBuy + Active Campaign
- ✅ Salvamento em lotes no Supabase
- ✅ Tratamento de erros robusto
- ✅ Cache local dos dados

### 2. **AutoSyncService.ts**  
- ✅ Sincronização automática configur

### 3. **preload-data.ts**
- ✅ Script de pré-carga completa
- ✅ Limpeza de dados antigos
- ✅ Verificação de integridade
- ✅ Execução via interface ou linha de comando

### 4. **SyncControlPanel.tsx**
- ✅ Interface visual para controle
- ✅ Monitoramento em tempo real
- ✅ Estatísticas por tenant
- ✅ Botões de controle

---

## 🎯 **PLANO DE EXECUÇÃO**

### **FASE 1: PRÉ-CARGA INICIAL** ⚡
```bash
# Executar ANTES de disponibilizar o sistema
npm run preload:bela-blue
```

**O que acontece:**
1. 🧹 Limpa dados antigos da Bela Blue no Supabase
2. 📦 Baixa **TODOS** os dados da WBuy (12+ endpoints)
3. 📧 Baixa **TODOS** os dados do Active Campaign (12+ endpoints)
4. 💾 Salva tudo no Supabase em lotes otimizados
5. ✅ Marca dados como válidos e prontos para uso

**Endpoints WBuy Sincronizados:**
- `clientes`, `produtos`, `pedidos`, `afiliados`
- `categorias`, `campanhas`, `envios`, `financeiro`
- `estoque`, `vendedores`, `cupons`, `relatorios`

**Endpoints Active Campaign Sincronizados:**
- `contacts`, `lists`, `campaigns`, `automations`
- `deals`, `accounts`, `tags`, `custom_fields`
- `forms`, `segments`, `messages`, `notes`

### **FASE 2: SINCRONIZAÇÃO AUTOMÁTICA** 🔄
```javascript
// Inicia automaticamente após pré-carga
globalAutoSync.start();
```

**Configuração:**
- ⏰ **Intervalo**: 1 minuto
- 🏢 **Tenants**: Bela Blue (expansível)
- 🔄 **Endpoints**: Todos os mesmos da pré-carga
- 📊 **Monitoramento**: Logs detalhados + estatísticas

### **FASE 3: MONITORAMENTO** 📊
- 🎛️ Painel de controle visual
- 📈 Estatísticas em tempo real
- ⚠️ Alertas de erro
- 🔍 Logs detalhados

---

## 💾 **ESTRUTURA DE DADOS NO SUPABASE**

### **Tabela: `api_data`**
```sql
- tenant_id (text) - Ex: 'bela_blue'
- api_source (text) - Ex: 'wbuy', 'activecampaign' 
- data_type (text) - Ex: 'clientes', 'produtos', 'contacts'
- external_id (text) - ID original do registro
- data (jsonb) - Dados completos do registro
- last_sync (timestamp) - Última sincronização
- created_at (timestamp) - Criação
- updated_at (timestamp) - Atualização
```

### **Tabela: `tenants`**
```sql
- tenant_id (text) - ID único do tenant
- name (text) - Nome do tenant
- is_active (boolean) - Se está ativo
- data_preloaded (boolean) - Se dados foram pré-carregados
- last_preload (timestamp) - Última pré-carga
- last_sync (timestamp) - Última sincronização
```

---

## 🚀 **COMO USAR NO LOVABLE**

### 1. **Executar Pré-carga** 
```typescript
import { runPreload } from '@/scripts/preload-data';

// Em um botão ou componente de admin
const handlePreload = async () => {
  await runPreload();
  alert('Pré-carga completa!');
};
```

### 2. **Iniciar Sincronização**
```typescript
import { globalAutoSync } from '@/services/sync/AutoSyncService';

// Iniciar sincronização automática
globalAutoSync.start();

// Verificar status
const status = globalAutoSync.getStatus();
console.log('Sincronização ativa:', status.isRunning);
```

### 3. **Usar Dados Sincronizados**
```typescript
import { DataSyncService } from '@/services/sync/DataSyncService';

const syncService = new DataSyncService();

// Buscar clientes da Bela Blue
const clientes = await syncService.getHistoricalData(
  'bela_blue', 
  'wbuy', 
  'clientes'
);

// Buscar contatos do Active Campaign
const contatos = await syncService.getHistoricalData(
  'bela_blue',
  'activecampaign', 
  'contacts'
);
```

### 4. **Componente de Controle**
```typescript
import SyncControlPanel from '@/components/sync/SyncControlPanel';

// Em uma página de admin
export default function AdminPage() {
  return (
    <div>
      <h1>Administração</h1>
      <SyncControlPanel />
    </div>
  );
}
```

---

## ⚙️ **CONFIGURAÇÕES DE AMBIENTE**

### **Variables do .env**
```env
# Supabase
VITE_SUPABASE_URL=https://zkjpzwrcuauieaaktzbk.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Bela Blue - WBuy
VITE_BELA_BLUE_WBUY_URL=https://sistema.sistemawbuy.com.br/api/v1
VITE_BELA_BLUE_WBUY_TOKEN=NjE2OTFkYTQtN2ZjOC00MTllLWEwNmQtYjllMDIxZDc1ZWZj...
VITE_BELA_BLUE_WBUY_STORE_ID=384388

# Bela Blue - Active Campaign  
VITE_BELA_BLUE_AC_URL=https://belablue.api-us1.com
VITE_BELA_BLUE_AC_KEY=39c8e1bb22c8e4dd2ccad4e9c71b5bd0a52db486535989...
```

---

## 🔄 **FLUXO DE SINCRONIZAÇÃO**

### **Pré-carga (Uma vez)**
```
1. Usuário clica "Executar Pré-carga"
2. Sistema limpa dados antigos
3. Faz requests para todas as APIs
4. Salva dados em lotes no Supabase
5. Marca como dados válidos
6. Sistema pronto para uso
```

### **Sincronização Automática (A cada minuto)**
```
1. Timer dispara a cada 60 segundos
2. Para cada tenant configurado:
   - Sincroniza dados WBuy
   - Sincroniza dados Active Campaign
   - Atualiza timestamp
   - Aguarda 30 segundos
3. Registra logs e estatísticas
4. Aguarda próximo ciclo
```

### **Acesso aos Dados (Sempre disponível)**
```
1. Blue CRM consulta dados do Supabase
2. Dados sempre disponíveis (não trava)
3. Dados atualizados automaticamente
4. Performance otimizada
```

---

## 📊 **VANTAGENS DESTA ARQUITETURA**

### ✅ **Para o Sistema**
- **Zero Downtime**: Dados sempre disponíveis localmente
- **Performance**: Consultas rápidas no Supabase vs APIs externas
- **Confiabilidade**: Backup automático de todos os dados
- **Escalabilidade**: Suporta múltiplos tenants facilmente

### ✅ **Para os Usuários**
- **Experiência Fluida**: Sem travamentos ou loading excessivo
- **Dados Atualizados**: Sincronização automática a cada minuto
- **Confiabilidade**: Sistema sempre funcional
- **Dados Históricos**: Acesso completo ao histórico

### ✅ **Para Você (Desenvolvedor)**
- **Monitoramento**: Painel completo de controle
- **Flexibilidade**: Fácil adição de novos endpoints
- **Debugging**: Logs detalhados de toda sincronização  
- **Manutenção**: Sistema modular e bem documentado

---

## 🎯 **PRÓXIMOS PASSOS**

### **Implementação Imediata**
1. ✅ Fazer push das alterações para GitHub
2. ✅ Testar no Lovable
3. ✅ Executar pré-carga da Bela Blue
4. ✅ Ativar sincronização automática
5. ✅ Monitorar por 24h

### **Melhorias Futuras**
- 📧 Notificações por email em caso de erro
- 📊 Dashboard com gráficos de performance
- 🔄 Sincronização diferencial (apenas alterações)
- 🏢 Interface para adicionar novos tenants
- 📱 Aplicativo mobile para monitoramento

---

## 🆘 **SUPORTE E TROUBLESHOOTING**

### **Problemas Comuns**
1. **Erro de autenticação API**: Verificar tokens no .env
2. **Timeout Supabase**: Reduzir batch size para 25
3. **Rate limit APIs**: Aumentar delay entre requests
4. **Memória insuficiente**: Processar dados em lotes menores

### **Comandos Úteis**
```bash
# Verificar status
npm run sync:status

# Ver logs  
npm run sync:logs

# Parar sincronização
npm run sync:stop

# Testar conexão APIs
npm run test:wbuy
npm run test:activecampaign
```

---

**🎉 SISTEMA PRONTO PARA PRODUÇÃO! 🎉**

*Este sistema garante que o Blue CRM seja robusto, confiável e escalável, mantendo todos os dados sincronizados automaticamente sem impactar a experiência do usuário.* 