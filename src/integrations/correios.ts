import axios from 'axios';
import { apiConfig } from './index';

export class CorreiosAPI {
    private config = apiConfig.correios;
    private client;

    constructor() {
        this.client = axios.create({
            baseURL: this.config.api_url,
            headers: this.config.headers
        });
    }

    async gerarAR(data: any) {
        try {
            const response = await this.client.post('/ar/v1/gerar', {
                ...data,
                contrato: this.config.numero_contrato,
                cnpj: this.config.cnpj
            });
            return response.data;
        } catch (error) {
            console.error('Erro ao gerar AR nos Correios:', error);
            throw error;
        }
    }

    async consultarAR(codigoAR: string) {
        try {
            const response = await this.client.get(`/ar/v1/consultar/${codigoAR}`, {
                params: {
                    contrato: this.config.numero_contrato,
                    cnpj: this.config.cnpj
                }
            });
            return response.data;
        } catch (error) {
            console.error('Erro ao consultar AR nos Correios:', error);
            throw error;
        }
    }

    async cancelarAR(codigoAR: string) {
        try {
            const response = await this.client.post(`/ar/v1/cancelar/${codigoAR}`, {
                contrato: this.config.numero_contrato,
                cnpj: this.config.cnpj
            });
            return response.data;
        } catch (error) {
            console.error('Erro ao cancelar AR nos Correios:', error);
            throw error;
        }
    }

    async imprimirAR(codigoAR: string) {
        try {
            const response = await this.client.get(`/ar/v1/imprimir/${codigoAR}`, {
                params: {
                    contrato: this.config.numero_contrato,
                    cnpj: this.config.cnpj
                },
                responseType: 'blob'
            });
            return response.data;
        } catch (error) {
            console.error('Erro ao imprimir AR nos Correios:', error);
            throw error;
        }
    }

    async validarToken() {
        try {
            const response = await this.client.get('/token/v1/validar', {
                headers: {
                    'Authorization': `Bearer ${this.config.token}`
                }
            });
            return response.data;
        } catch (error) {
            console.error('Erro ao validar token dos Correios:', error);
            throw error;
        }
    }

    async renovarToken() {
        try {
            const response = await this.client.post('/token/v1/renovar', {
                usuario: this.config.usuario,
                senha: this.config.senha
            });
            
            this.config.token = response.data.token;
            return response.data;
        } catch (error) {
            console.error('Erro ao renovar token dos Correios:', error);
            throw error;
        }
    }
} 