# 🚀 CONFIGURAÇÃO SUPABASE - BLUE CRM

## 📋 **PASSOS PARA CONFIGURAR**

### **1. 📝 Configurar .env**
Copie todo o conteúdo do arquivo `CONFIGURACAO_SUPABASE.txt` para o arquivo `.env`:

```bash
# Abrir .env
notepad .env

# Colar todo o conteúdo de CONFIGURACAO_SUPABASE.txt
# Salvar e fechar
```

### **2. 🗄️ Configurar Banco de Dados**

**Acesse seu Supabase:**
- URL: https://zkjpzwrcuauieaaktzbk.supabase.co
- Vá em: `SQL Editor` > `New Query`

**Execute este SQL:**

```sql
-- ========================================
-- 🏢 BLUE CRM - CONFIGURAÇÃO INICIAL
-- ========================================

-- 1. Criar tabela de tenants
CREATE TABLE IF NOT EXISTS tenants (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id TEXT UNIQUE NOT NULL,
    company_name TEXT NOT NULL,
    is_master BOOLEAN DEFAULT false,
    is_active BOOLEAN DEFAULT true,
    subscription_plan TEXT DEFAULT 'basic',
    access_bela_blue BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Criar tabela de APIs por tenant
CREATE TABLE IF NOT EXISTS tenant_apis (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id TEXT NOT NULL REFERENCES tenants(tenant_id),
    api_type TEXT NOT NULL,
    api_config JSONB NOT NULL,
    is_enabled BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(tenant_id, api_type)
);

-- 3. Criar tabela de permissões
CREATE TABLE IF NOT EXISTS user_permissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id),
    tenant_id TEXT NOT NULL REFERENCES tenants(tenant_id),
    role TEXT NOT NULL,
    access_level TEXT NOT NULL,
    can_view_bela_blue BOOLEAN DEFAULT true,
    can_edit_api_configs BOOLEAN DEFAULT false,
    can_manage_users BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Criar tabela de dados WBuy
CREATE TABLE IF NOT EXISTS wbuy_data (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id TEXT NOT NULL REFERENCES tenants(tenant_id),
    data_type TEXT NOT NULL,
    external_id TEXT,
    data JSONB NOT NULL,
    last_sync TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Inserir Bela Blue como tenant master
INSERT INTO tenants (tenant_id, company_name, is_master, is_active, subscription_plan, access_bela_blue)
VALUES ('bela_blue', 'Bela Blue Beauty', true, true, 'enterprise', true)
ON CONFLICT (tenant_id) DO NOTHING;

-- 6. Inserir APIs da Bela Blue
INSERT INTO tenant_apis (tenant_id, api_type, api_config, is_enabled) VALUES
('bela_blue', 'wbuy', '{
    "url": "https://sistema.sistemawbuy.com.br/api/v1",
    "token": "NjE2OTFkYTQtN2ZjOC00MTllLWEwNmQtYjllMDIxZDc1ZWZjOmViYTgzYWYwZTViMTQxNTE4MmQyNjdlZjE3NGNjMmE5",
    "store_id": "384388"
}', true),
('bela_blue', 'tiny', '{
    "url": "https://api.tiny.com.br/api2",
    "token": "17c9cacf9b044b1201e9ec681ed5fa7c943346ee6b89c7859a2db93cd86a87c7"
}', true)
ON CONFLICT (tenant_id, api_type) DO NOTHING;
```

### **3. 🔒 Configurar Row Level Security**

**Execute este SQL também:**

```sql
-- Habilitar RLS
ALTER TABLE tenants ENABLE ROW LEVEL SECURITY;
ALTER TABLE tenant_apis ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_permissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE wbuy_data ENABLE ROW LEVEL SECURITY;

-- Função para verificar super admin
CREATE OR REPLACE FUNCTION is_super_admin()
RETURNS BOOLEAN AS $$
BEGIN
    RETURN auth.jwt() ->> 'email' = 'leooliveiramktd@gmail.com';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Políticas de acesso
CREATE POLICY "tenants_policy" ON tenants FOR ALL USING (
    is_super_admin() OR tenant_id IN (
        SELECT tenant_id FROM user_permissions WHERE user_id = auth.uid()
    )
);

CREATE POLICY "wbuy_data_policy" ON wbuy_data FOR SELECT USING (
    is_super_admin() OR 
    tenant_id IN (SELECT tenant_id FROM user_permissions WHERE user_id = auth.uid()) OR
    tenant_id = 'bela_blue'
);
```

### **4. 🚀 Testar o Sistema**

**Iniciar o servidor:**
```bash
npm run dev
```

**Acessar:** http://localhost:5173

**Login de teste:**
- Email: leooliveiramktd@gmail.com
- Senha: qualquer (sistema detecta automaticamente que você é Super Admin)

### **5. ✅ Verificar se Funcionou**

**Você deve ver:**
- Badge "👑 Super Admin"
- Acesso a todas as funcionalidades
- Dados da Bela Blue carregando
- Menus com base nas permissões

---

## 🎯 **PRÓXIMOS PASSOS**

1. **✅ Configurar .env** com credenciais Supabase
2. **✅ Executar SQL** no painel Supabase
3. **✅ Testar login** como Super Admin
4. **📝 Adicionar empresas** quando necessário
5. **👥 Convidar usuários** com diferentes níveis

---

## 🔧 **TROUBLESHOOTING**

**Se der erro de conexão:**
- Verificar se as credenciais Supabase estão corretas
- Confirmar se o SQL foi executado sem erros
- Checar se RLS está configurado

**Se não conseguir fazer login:**
- Verificar se o email no .env está correto
- Confirmar se a função `is_super_admin()` foi criada
- Testar a conexão com Supabase

**Se não vir dados:**
- Verificar se os dados da Bela Blue foram inseridos
- Confirmar se as políticas RLS estão ativas
- Checar logs do console do navegador 