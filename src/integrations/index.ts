import { WBuyAPI } from './wbuy';
import { TinyAPI } from './tiny';
import { CorreiosAPI } from './correios';
import { SupabaseAPI } from './supabase';
import { FacebookAPI } from './facebook';

export {
    WBuyAPI,
    TinyAPI,
    CorreiosAPI,
    SupabaseAPI,
    FacebookAPI
};

// Configuração centralizada das APIs
export const apiConfig = {
    wbuy: {
        api_url: process.env.WBUY_API_URL || 'https://sistema.sistemawbuy.com.br/api/v1',
        store_id: process.env.WBUY_STORE_ID,
        api_key: process.env.WBUY_API_KEY,
        api_token: process.env.WBUY_API_TOKEN,
        endpoints: {
            products: 'product/list',
            categories: 'category/list',
            product_detail: 'product'
        }
    },
    tiny: {
        api_url: process.env.TINY_API_URL || 'https://api.tiny.com.br/api2',
        api_token: process.env.TINY_API_TOKEN,
        oauth: {
            access_token: process.env.TINY_ACCESS_TOKEN,
            refresh_token: process.env.TINY_REFRESH_TOKEN,
            expires_at: 0
        },
        client_id: process.env.TINY_CLIENT_ID,
        client_secret: process.env.TINY_CLIENT_SECRET,
        redirect_url: process.env.TINY_REDIRECT_URL || 'https://localhost:3000/api/tiny/callback',
        endpoints: {
            products_search: 'produtos.pesquisa.php',
            product_get: 'produto.obter.php',
            product_include: 'produto.incluir.php',
            product_update: 'produto.alterar.php',
            categories: 'categorias.pesquisa.php'
        }
    },
    correios: {
        api_url: process.env.CORREIOS_API_URL || 'https://apps3.correios.com.br/areletronico',
        api_key: process.env.CORREIOS_API_KEY,
        token: process.env.CORREIOS_TOKEN,
        usuario: process.env.CORREIOS_USUARIO,
        senha: process.env.CORREIOS_SENHA,
        numero_contrato: process.env.CORREIOS_NUMERO_CONTRATO,
        cnpj: process.env.CORREIOS_CNPJ,
        api_id: 392,
        api_nome: 'AR Eletrônico',
        headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
            'X-Correios-API-Key': process.env.CORREIOS_API_KEY,
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        }
    },
    supabase: {
        url: process.env.SUPABASE_URL,
        public_key: process.env.SUPABASE_PUBLIC_KEY
    },
    facebook: {
        api_url: process.env.FACEBOOK_API_URL || 'https://graph.facebook.com/v18.0',
        endpoints: {
            business_accounts: '/me/businesses',
            ad_accounts: '/{businessId}/client_ad_accounts',
            campaigns: '/act_{adAccountId}/campaigns',
            insights: '/act_{adAccountId}/insights'
        }
    }
}; 