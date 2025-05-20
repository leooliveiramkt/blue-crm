-- Tabela de empresas
CREATE TABLE IF NOT EXISTS companies (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de configurações da WBuy
CREATE TABLE IF NOT EXISTS wbuy_configs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
    api_url TEXT NOT NULL,
    api_key TEXT NOT NULL,
    store_id TEXT NOT NULL,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(company_id)
);

-- Tabela de usuários da empresa
CREATE TABLE IF NOT EXISTS company_users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    role TEXT NOT NULL CHECK (role IN ('admin', 'manager', 'user')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(company_id, user_id)
);

-- Políticas de segurança (RLS)
ALTER TABLE companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE wbuy_configs ENABLE ROW LEVEL SECURITY;
ALTER TABLE company_users ENABLE ROW LEVEL SECURITY;

-- Política para companies
CREATE POLICY "Usuários podem ver suas próprias empresas"
    ON companies FOR SELECT
    USING (
        id IN (
            SELECT company_id 
            FROM company_users 
            WHERE user_id = auth.uid()
        )
    );

-- Política para wbuy_configs
CREATE POLICY "Usuários podem ver configurações de suas empresas"
    ON wbuy_configs FOR SELECT
    USING (
        company_id IN (
            SELECT company_id 
            FROM company_users 
            WHERE user_id = auth.uid()
        )
    );

CREATE POLICY "Apenas admins podem modificar configurações"
    ON wbuy_configs FOR ALL
    USING (
        company_id IN (
            SELECT company_id 
            FROM company_users 
            WHERE user_id = auth.uid() 
            AND role = 'admin'
        )
    );

-- Política para company_users
CREATE POLICY "Usuários podem ver membros de suas empresas"
    ON company_users FOR SELECT
    USING (
        company_id IN (
            SELECT company_id 
            FROM company_users 
            WHERE user_id = auth.uid()
        )
    );

-- Função para criar uma nova empresa com configuração WBuy
CREATE OR REPLACE FUNCTION create_company_with_wbuy_config(
    company_name TEXT,
    company_slug TEXT,
    wbuy_api_url TEXT,
    wbuy_api_key TEXT,
    wbuy_store_id TEXT
) RETURNS UUID AS $$
DECLARE
    new_company_id UUID;
BEGIN
    -- Criar empresa
    INSERT INTO companies (name, slug)
    VALUES (company_name, company_slug)
    RETURNING id INTO new_company_id;

    -- Criar configuração WBuy
    INSERT INTO wbuy_configs (company_id, api_url, api_key, store_id)
    VALUES (new_company_id, wbuy_api_url, wbuy_api_key, wbuy_store_id);

    -- Adicionar usuário atual como admin
    INSERT INTO company_users (company_id, user_id, role)
    VALUES (new_company_id, auth.uid(), 'admin');

    RETURN new_company_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER; 