-- Tabela de configurações da Bela Blue
CREATE TABLE IF NOT EXISTS bela_blue_configs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_name TEXT NOT NULL DEFAULT 'Bela Blue',
    wbuy_api_url TEXT NOT NULL DEFAULT 'https://sistema.sistemawbuy.com.br/api/v1',
    wbuy_api_key TEXT NOT NULL,
    wbuy_store_id TEXT NOT NULL,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Políticas de segurança (RLS)
ALTER TABLE bela_blue_configs ENABLE ROW LEVEL SECURITY;

-- Política para configurações da Bela Blue
CREATE POLICY "Apenas funcionários da Bela Blue podem ver as configurações"
    ON bela_blue_configs FOR SELECT
    USING (
        auth.uid() IN (
            SELECT user_id 
            FROM company_users 
            WHERE company_id = 'bela-blue' 
            AND role IN ('admin', 'manager', 'user')
        )
    );

CREATE POLICY "Apenas administradores da Bela Blue podem modificar as configurações"
    ON bela_blue_configs FOR ALL
    USING (
        auth.uid() IN (
            SELECT user_id 
            FROM company_users 
            WHERE company_id = 'bela-blue' 
            AND role = 'admin'
        )
    );

-- Inserir configuração inicial da Bela Blue
INSERT INTO bela_blue_configs (
    company_name,
    wbuy_api_url,
    wbuy_api_key,
    wbuy_store_id,
    is_active
) VALUES (
    'Bela Blue',
    'https://sistema.sistemawbuy.com.br/api/v1',
    'Bearer seu_token_aqui',
    'seu_store_id_aqui',
    true
) ON CONFLICT DO NOTHING; 