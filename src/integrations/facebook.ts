import axios from 'axios';
import { apiConfig } from './index';

export class FacebookAPI {
    private config = apiConfig.facebook;
    private client;

    constructor() {
        this.client = axios.create({
            baseURL: this.config.api_url,
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        });
    }

    async getBusinessAccounts(accessToken: string) {
        try {
            const response = await this.client.get(this.config.endpoints.business_accounts, {
                params: {
                    access_token: accessToken
                }
            });
            return response.data;
        } catch (error) {
            console.error('Erro ao buscar contas de negócios do Facebook:', error);
            throw error;
        }
    }

    async getAdAccounts(businessId: string, accessToken: string) {
        try {
            const response = await this.client.get(
                this.config.endpoints.ad_accounts.replace('{businessId}', businessId),
                {
                    params: {
                        access_token: accessToken
                    }
                }
            );
            return response.data;
        } catch (error) {
            console.error('Erro ao buscar contas de anúncios do Facebook:', error);
            throw error;
        }
    }

    async getCampaigns(adAccountId: string, accessToken: string, params?: any) {
        try {
            const response = await this.client.get(
                this.config.endpoints.campaigns.replace('{adAccountId}', adAccountId),
                {
                    params: {
                        access_token: accessToken,
                        ...params
                    }
                }
            );
            return response.data;
        } catch (error) {
            console.error('Erro ao buscar campanhas do Facebook:', error);
            throw error;
        }
    }

    async getInsights(adAccountId: string, accessToken: string, params?: any) {
        try {
            const response = await this.client.get(
                this.config.endpoints.insights.replace('{adAccountId}', adAccountId),
                {
                    params: {
                        access_token: accessToken,
                        ...params
                    }
                }
            );
            return response.data;
        } catch (error) {
            console.error('Erro ao buscar insights do Facebook:', error);
            throw error;
        }
    }

    async createCampaign(adAccountId: string, accessToken: string, data: any) {
        try {
            const response = await this.client.post(
                this.config.endpoints.campaigns.replace('{adAccountId}', adAccountId),
                data,
                {
                    params: {
                        access_token: accessToken
                    }
                }
            );
            return response.data;
        } catch (error) {
            console.error('Erro ao criar campanha no Facebook:', error);
            throw error;
        }
    }

    async updateCampaign(campaignId: string, accessToken: string, data: any) {
        try {
            const response = await this.client.post(
                `/${campaignId}`,
                data,
                {
                    params: {
                        access_token: accessToken
                    }
                }
            );
            return response.data;
        } catch (error) {
            console.error('Erro ao atualizar campanha no Facebook:', error);
            throw error;
        }
    }

    async deleteCampaign(campaignId: string, accessToken: string) {
        try {
            const response = await this.client.delete(
                `/${campaignId}`,
                {
                    params: {
                        access_token: accessToken
                    }
                }
            );
            return response.data;
        } catch (error) {
            console.error('Erro ao deletar campanha no Facebook:', error);
            throw error;
        }
    }
} 