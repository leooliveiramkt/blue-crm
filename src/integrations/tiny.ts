import axios from 'axios';
import { apiConfig } from './index';

export class TinyAPI {
    private config = apiConfig.tiny;
    private client;

    constructor() {
        this.client = axios.create({
            baseURL: this.config.api_url,
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'X-API-Token': this.config.api_token
            }
        });
    }

    async searchProducts(params?: any) {
        try {
            const response = await this.client.post(this.config.endpoints.products_search, {
                token: this.config.api_token,
                ...params
            });
            return response.data;
        } catch (error) {
            console.error('Erro ao buscar produtos no Tiny:', error);
            throw error;
        }
    }

    async getProduct(productId: string) {
        try {
            const response = await this.client.post(this.config.endpoints.product_get, {
                token: this.config.api_token,
                id: productId
            });
            return response.data;
        } catch (error) {
            console.error('Erro ao buscar produto no Tiny:', error);
            throw error;
        }
    }

    async createProduct(data: any) {
        try {
            const response = await this.client.post(this.config.endpoints.product_include, {
                token: this.config.api_token,
                produto: data
            });
            return response.data;
        } catch (error) {
            console.error('Erro ao criar produto no Tiny:', error);
            throw error;
        }
    }

    async updateProduct(productId: string, data: any) {
        try {
            const response = await this.client.post(this.config.endpoints.product_update, {
                token: this.config.api_token,
                produto: {
                    id: productId,
                    ...data
                }
            });
            return response.data;
        } catch (error) {
            console.error('Erro ao atualizar produto no Tiny:', error);
            throw error;
        }
    }

    async getCategories(params?: any) {
        try {
            const response = await this.client.post(this.config.endpoints.categories, {
                token: this.config.api_token,
                ...params
            });
            return response.data;
        } catch (error) {
            console.error('Erro ao buscar categorias no Tiny:', error);
            throw error;
        }
    }

    async refreshToken() {
        try {
            const response = await axios.post('https://api.tiny.com.br/oauth/token', {
                grant_type: 'refresh_token',
                client_id: this.config.client_id,
                client_secret: this.config.client_secret,
                refresh_token: this.config.oauth.refresh_token
            });
            
            this.config.oauth.access_token = response.data.access_token;
            this.config.oauth.refresh_token = response.data.refresh_token;
            this.config.oauth.expires_at = Date.now() + (response.data.expires_in * 1000);
            
            return response.data;
        } catch (error) {
            console.error('Erro ao atualizar token do Tiny:', error);
            throw error;
        }
    }
} 