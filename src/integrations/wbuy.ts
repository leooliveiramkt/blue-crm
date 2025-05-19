import axios from 'axios';
import { apiConfig } from './index';

export class WBuyAPI {
    private config = apiConfig.wbuy;
    private client;

    constructor() {
        this.client = axios.create({
            baseURL: this.config.api_url,
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'X-API-Key': this.config.api_key,
                'X-API-Token': this.config.api_token
            }
        });
    }

    async getProducts(params?: any) {
        try {
            const response = await this.client.get(this.config.endpoints.products, { params });
            return response.data;
        } catch (error) {
            console.error('Erro ao buscar produtos do WBuy:', error);
            throw error;
        }
    }

    async getCategories(params?: any) {
        try {
            const response = await this.client.get(this.config.endpoints.categories, { params });
            return response.data;
        } catch (error) {
            console.error('Erro ao buscar categorias do WBuy:', error);
            throw error;
        }
    }

    async getProductDetail(productId: string) {
        try {
            const response = await this.client.get(`${this.config.endpoints.product_detail}/${productId}`);
            return response.data;
        } catch (error) {
            console.error('Erro ao buscar detalhes do produto do WBuy:', error);
            throw error;
        }
    }

    async updateProduct(productId: string, data: any) {
        try {
            const response = await this.client.put(`${this.config.endpoints.product_detail}/${productId}`, data);
            return response.data;
        } catch (error) {
            console.error('Erro ao atualizar produto no WBuy:', error);
            throw error;
        }
    }

    async createProduct(data: any) {
        try {
            const response = await this.client.post(this.config.endpoints.product_detail, data);
            return response.data;
        } catch (error) {
            console.error('Erro ao criar produto no WBuy:', error);
            throw error;
        }
    }

    async deleteProduct(productId: string) {
        try {
            const response = await this.client.delete(`${this.config.endpoints.product_detail}/${productId}`);
            return response.data;
        } catch (error) {
            console.error('Erro ao deletar produto no WBuy:', error);
            throw error;
        }
    }
} 