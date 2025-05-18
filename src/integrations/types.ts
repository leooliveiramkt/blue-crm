// WBuy Types
export interface WBuyProduct {
    id: string;
    name: string;
    description: string;
    price: number;
    stock: number;
    category: string;
    ncm: string;
    sku: string;
    created_at: string;
    updated_at: string;
}

export interface WBuyCategory {
    id: string;
    name: string;
    parent_id?: string;
    created_at: string;
    updated_at: string;
}

// Tiny Types
export interface TinyProduct {
    id: string;
    codigo: string;
    nome: string;
    descricao: string;
    preco: number;
    estoque: number;
    categoria: string;
    ncm: string;
    data_criacao: string;
    data_atualizacao: string;
}

export interface TinyCategory {
    id: string;
    nome: string;
    id_pai?: string;
    data_criacao: string;
    data_atualizacao: string;
}

// Correios Types
export interface CorreiosAR {
    codigo: string;
    tipo: string;
    valor: number;
    destinatario: {
        nome: string;
        cpf_cnpj: string;
        endereco: string;
        numero: string;
        complemento?: string;
        bairro: string;
        cidade: string;
        uf: string;
        cep: string;
    };
    remetente: {
        nome: string;
        cpf_cnpj: string;
        endereco: string;
        numero: string;
        complemento?: string;
        bairro: string;
        cidade: string;
        uf: string;
        cep: string;
    };
    data_geracao: string;
    status: string;
}

// Facebook Types
export interface FacebookBusinessAccount {
    id: string;
    name: string;
    created_time: string;
    updated_time: string;
}

export interface FacebookAdAccount {
    id: string;
    name: string;
    account_id: string;
    business_id: string;
    created_time: string;
    updated_time: string;
}

export interface FacebookCampaign {
    id: string;
    name: string;
    objective: string;
    status: string;
    created_time: string;
    updated_time: string;
}

export interface FacebookInsights {
    campaign_id: string;
    date_start: string;
    date_stop: string;
    spend: number;
    impressions: number;
    clicks: number;
    reach: number;
    frequency: number;
    cpc: number;
    cpm: number;
    ctr: number;
}

// Supabase Types
export interface SupabaseProduct {
    id: string;
    name: string;
    description: string;
    price: number;
    stock: number;
    category_id: string;
    ncm: string;
    sku: string;
    created_at: string;
    updated_at: string;
}

export interface SupabaseCategory {
    id: string;
    name: string;
    parent_id?: string;
    created_at: string;
    updated_at: string;
}

// API Response Types
export interface APIResponse<T> {
    success: boolean;
    data?: T;
    error?: {
        code: string;
        message: string;
        details?: any;
    };
}

// API Config Types
export interface APIConfig {
    wbuy: {
        api_url: string;
        store_id: string;
        api_key: string;
        api_token: string;
        endpoints: {
            products: string;
            categories: string;
            product_detail: string;
        };
    };
    tiny: {
        api_url: string;
        api_token: string;
        oauth: {
            access_token: string;
            refresh_token: string;
            expires_at: number;
        };
        client_id: string;
        client_secret: string;
        redirect_url: string;
        endpoints: {
            products_search: string;
            product_get: string;
            product_include: string;
            product_update: string;
            categories: string;
        };
    };
    correios: {
        api_url: string;
        api_key: string;
        token: string;
        usuario: string;
        senha: string;
        numero_contrato: string;
        cnpj: string;
        api_id: number;
        api_nome: string;
        headers: {
            [key: string]: string;
        };
    };
    supabase: {
        url: string;
        public_key: string;
    };
    facebook: {
        api_url: string;
        endpoints: {
            business_accounts: string;
            ad_accounts: string;
            campaigns: string;
            insights: string;
        };
    };
} 