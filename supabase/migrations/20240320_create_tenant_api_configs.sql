-- Tabela de configurações de API por tenant
CREATE TABLE IF NOT EXISTS tenant_api_configs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    integration_id TEXT NOT NULL,
    api_key TEXT NOT NULL,
    api_url TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Políticas de segurança (RLS)
ALTER TABLE tenant_api_configs ENABLE ROW LEVEL SECURITY;

-- Política para configurações de API
CREATE POLICY "Usuários podem ver suas próprias configurações de API"
    ON tenant_api_configs FOR SELECT
    USING (tenant_id = auth.uid());

CREATE POLICY "Usuários podem criar suas próprias configurações de API"
    ON tenant_api_configs FOR INSERT
    WITH CHECK (tenant_id = auth.uid());

CREATE POLICY "Usuários podem atualizar suas próprias configurações de API"
    ON tenant_api_configs FOR UPDATE
    USING (tenant_id = auth.uid());

CREATE POLICY "Usuários podem deletar suas próprias configurações de API"
    ON tenant_api_configs FOR DELETE
    USING (tenant_id = auth.uid()); 