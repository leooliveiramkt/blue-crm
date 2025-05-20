-- Tabela de integrações
CREATE TABLE IF NOT EXISTS integrations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    integration_id TEXT NOT NULL,
    credentials JSONB NOT NULL,
    status TEXT NOT NULL CHECK (status IN ('connected', 'disconnected', 'error')),
    metadata JSONB,
    last_sync TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Políticas de segurança (RLS)
ALTER TABLE integrations ENABLE ROW LEVEL SECURITY;

-- Política para integrações
CREATE POLICY "Usuários podem ver suas próprias integrações"
    ON integrations FOR SELECT
    USING (user_id = auth.uid());

CREATE POLICY "Usuários podem criar suas próprias integrações"
    ON integrations FOR INSERT
    WITH CHECK (user_id = auth.uid());

CREATE POLICY "Usuários podem atualizar suas próprias integrações"
    ON integrations FOR UPDATE
    USING (user_id = auth.uid());

CREATE POLICY "Usuários podem deletar suas próprias integrações"
    ON integrations FOR DELETE
    USING (user_id = auth.uid()); 