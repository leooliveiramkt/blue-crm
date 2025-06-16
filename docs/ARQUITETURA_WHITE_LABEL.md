# 🏢 BLUE CRM - ARQUITETURA WHITE LABEL

## 🎯 **Visão Geral**

O Blue CRM é um **sistema White Label multi-tenant** que permite:
- **Empresas clientes** configurarem suas próprias APIs
- **Isolamento completo** de dados por tenant
- **Acesso compartilhado** aos dados da Bela Blue como benefício
- **Hierarquia de usuários** com diferentes níveis de acesso

---

## 👑 **ESTRUTURA DE USUÁRIOS**

### **1. Super Admin (Proprietário)**
```
Email: leooliveiramktd@gmail.com
Papel: Proprietário do sistema
Acesso: TOTAL - Todos os tenants
```

**Permissões:**
- ✅ Visualizar dados de **TODAS** as empresas
- ✅ Configurar APIs de qualquer tenant
- ✅ Gerenciar usuários globalmente
- ✅ Acesso ao painel de administração global
- ✅ Relatórios consolidados de todos os tenants

### **2. Tenant Admin (Empresas Clientes)**
```
Exemplo: admin@empresa1.com, admin@empresa2.com
Papel: Administrador da empresa cliente
Acesso: Sua empresa + Dados Bela Blue
```

**Permissões:**
- ✅ Configurar APIs da sua empresa
- ✅ Gerenciar usuários da sua empresa
- ✅ **Visualizar dados da Bela Blue** (benefício)
- ✅ Relatórios da sua empresa + Bela Blue
- ❌ Não acessa dados de outras empresas

### **3. Funcionários/Diretores**
```
Níveis: Diretor, Gerente, Funcionário, Consulta
Acesso: Sua empresa + Dados Bela Blue (limitado)
```

**Permissões por Nível:**
- **Diretor**: Acesso completo empresa + dados Bela Blue
- **Gerente**: Relatórios e analytics empresa + Bela Blue
- **Funcionário**: Operações básicas + visualização Bela Blue
- **Consulta**: Apenas visualização empresa + Bela Blue

---

## 🏗️ **ESTRUTURA DE TENANTS**

### **Tenant Principal: BELA BLUE**
```json
{
  "tenant_id": "bela_blue",
  "company_name": "Bela Blue Beauty",
  "is_master": true,
  "apis": {
    "wbuy": {
      "url": "https://sistema.sistemawbuy.com.br/api/v1",
      "token": "NjE2OTFkYTQtN2ZjOC00MTllLWEwNmQtYjllMDIxZDc1ZWZjOmViYTgzYWYwZTViMTQxNTE4MmQyNjdlZjE3NGNjMmE5",
      "store_id": "384388"
    },
    "tiny": {
      "url": "https://api.tiny.com.br/api2",
      "token": "17c9cacf9b044b1201e9ec681ed5fa7c943346ee6b89c7859a2db93cd86a87c7"
    }
  },
  "shared_with_all": true
}
```

### **Tenants Clientes**
```json
{
  "tenant_id": "empresa_x",
  "company_name": "Empresa X LTDA",
  "is_master": false,
  "apis": {
    "wbuy": {
      "url": "https://api.empresax.com.br",
      "token": "token_empresa_x"
    }
  },
  "access_bela_blue": true
}
```

---

## 🔒 **SISTEMA DE PERMISSÕES**

### **Tabela: user_permissions**
```sql
CREATE TABLE user_permissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id),
  tenant_id TEXT NOT NULL,
  role TEXT NOT NULL, -- 'super_admin', 'tenant_admin', 'director', 'manager', 'employee', 'view_only'
  can_view_bela_blue BOOLEAN DEFAULT true,
  can_edit_apis BOOLEAN DEFAULT false,
  can_manage_users BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW()
);
```

### **Regras de Acesso (RLS - Row Level Security)**
```sql
-- Usuários só veem dados do seu tenant + Bela Blue
CREATE POLICY tenant_isolation ON wbuy_data 
FOR SELECT USING (
  tenant_id = current_user_tenant() 
  OR tenant_id = 'bela_blue'
);

-- Super admin vê tudo
CREATE POLICY super_admin_access ON wbuy_data 
FOR ALL USING (
  is_super_admin(auth.uid())
);
```

---

## 🌐 **CONFIGURAÇÃO MULTI-TENANT**

### **1. Variáveis de Ambiente**
```env
# Super Admin
SUPER_ADMIN_EMAIL=leooliveiramktd@gmail.com

# Tenant Master (dados compartilhados)
MASTER_TENANT=bela_blue

# Configuração White Label
ENABLE_TENANT_REGISTRATION=true
ENABLE_BELA_BLUE_SHARING=true
DEFAULT_THEME=blue_crm
```

### **2. Configuração de APIs por Tenant**
```typescript
interface TenantConfig {
  tenant_id: string;
  company_name: string;
  apis: {
    wbuy?: WBuyConfig;
    tiny?: TinyConfig;
    activecampaign?: ActiveCampaignConfig;
    google_analytics?: GoogleAnalyticsConfig;
  };
  access_bela_blue: boolean;
  custom_branding?: {
    logo_url: string;
    primary_color: string;
    company_name: string;
  };
}
```

---

## 📊 **PAINEL DE DADOS COMPARTILHADOS**

### **Para Tenant Admins e Funcionários:**
```typescript
// Dados disponíveis de Bela Blue
interface BelaBlueSharedData {
  // Dados agregados (sem informações sensíveis)
  monthly_sales: number;
  top_products: ProductStats[];
  performance_metrics: {
    conversion_rate: number;
    avg_order_value: number;
    customer_retention: number;
  };
  market_insights: MarketTrend[];
  best_practices: BestPractice[];
}
```

**Benefícios para Clientes:**
- 📈 **Benchmarking**: Compare com dados de uma empresa de sucesso
- 🎯 **Insights de Mercado**: Tendências baseadas em dados reais
- 💡 **Melhores Práticas**: Estratégias que funcionam
- 📊 **Análises Comparativas**: Performance relativa ao mercado

---

## 🚀 **PROCESSO DE ONBOARDING**

### **1. Nova Empresa Cliente:**
1. **Cadastro**: Empresa se cadastra no sistema
2. **Configuração**: Admin define dados da empresa e APIs
3. **Usuários**: Convida funcionários com níveis de acesso
4. **Ativação**: Sistema ativa acesso aos dados Bela Blue
5. **Treinamento**: Documentação e suporte inicial

### **2. Configuração de APIs:**
```typescript
// Interface para configuração de APIs
const setupTenantAPIs = async (tenantId: string, apis: APIConfig[]) => {
  // Cada tenant configura suas próprias credenciais
  // Sistema valida e testa conexões
  // Dados ficam isolados por tenant
  // Acesso automático aos dados Bela Blue
};
```

---

## 🔐 **SEGURANÇA E ISOLAMENTO**

### **1. Isolamento de Dados:**
- **Tenant ID** obrigatório em todas as queries
- **RLS (Row Level Security)** no Supabase
- **APIs isoladas** por tenant
- **Logs auditáveis** de todos os acessos

### **2. Compartilhamento Controlado:**
- Dados Bela Blue **agregados e anonimizados**
- **Sem informações sensíveis** (emails, documentos, etc.)
- **Controle granular** do que é compartilhado
- **Opt-out** disponível se necessário

### **3. Autenticação:**
```typescript
interface UserSession {
  user_id: string;
  email: string;
  tenant_id: string;
  role: UserRole;
  can_access_bela_blue: boolean;
  permissions: Permission[];
}
```

---

## 💰 **MODELO DE NEGÓCIO**

### **Planos de Acesso:**
1. **Básico**: Apenas dados da própria empresa
2. **Premium**: Dados da empresa + Dados Bela Blue
3. **Enterprise**: Tudo + Consultoria personalizada

### **Valor Agregado:**
- **Dados de Referência**: Acesso a métricas de empresa de sucesso
- **Benchmark Contínuo**: Compare performance constantemente
- **Insights Exclusivos**: Análises baseadas em dados reais
- **Rede de Conhecimento**: Aprenda com quem já teve sucesso

---

## 📈 **ROADMAP**

### **Fase 1 (Atual):**
- ✅ Sistema multi-tenant básico
- ✅ Configuração Bela Blue
- ✅ Estrutura de permissões

### **Fase 2:**
- 🔄 Interface de cadastro de tenants
- 🔄 Painel compartilhamento Bela Blue
- 🔄 Sistema de convites

### **Fase 3:**
- 📋 Analytics comparativos
- 📋 Relatórios automáticos
- 📋 API marketplace

---

## 🎯 **VALOR ÚNICO**

O Blue CRM não é apenas um CRM White Label comum. É um **ecossistema de dados** onde:

1. **Empresas aprendem** com dados reais de sucesso
2. **Bela Blue monetiza** seus dados de forma inteligente
3. **Clientes obtêm insights** valiosos para crescer
4. **Todos crescem juntos** em uma rede colaborativa

**Essa é a verdadeira inovação do Blue CRM White Label!**

---

*Documentação criada por: Léo Oliveira*  
*Data: 20/05/2025*  
*Versão: 1.0* 