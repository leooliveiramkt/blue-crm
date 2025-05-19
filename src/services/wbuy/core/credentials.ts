
import { wbuyConfig } from "@/config/wbuy";
import { integrationManager } from "@/lib/integrations/integrationManager";

/**
 * Interface para credenciais Wbuy
 */
export interface Credentials {
  apiKey: string;
  domain: string;
  storeId: string;
  username: string;
  password: string;
}

/**
 * Serviço para gerenciar credenciais da API Wbuy
 */
export class CredentialsService {
  /**
   * Obtém as credenciais de integração Wbuy do tenant atual
   * @returns Credenciais da API Wbuy ou credenciais padrão
   */
  async getCredentials(): Promise<Credentials> {
    try {
      const integration = await integrationManager.getIntegration('wbuy');
      
      if (integration && integration.status === 'connected') {
        const apiKey = integration.credentials.apiKey;
        const domain = integration.credentials.domain;
        const storeId = integration.credentials.storeId;
        const username = integration.credentials.username;
        const password = integration.credentials.password;

        // Verificar se todas as credenciais necessárias estão presentes
        if (apiKey && domain && storeId && username && password) {
          return { apiKey, domain, storeId, username, password };
        } else {
          console.warn('Credenciais Wbuy incompletas, usando padrão');
        }
      }

      // Retorna as credenciais padrão definidas no config
      console.log('Usando credenciais padrão para Wbuy API');
      return { 
        apiKey: wbuyConfig.api_token, 
        domain: wbuyConfig.api_url,
        storeId: wbuyConfig.store_id,
        username: '',
        password: ''
      };
    } catch (error) {
      console.error('Erro ao obter credenciais Wbuy, usando padrão:', error);
      return { 
        apiKey: wbuyConfig.api_token, 
        domain: wbuyConfig.api_url,
        storeId: wbuyConfig.store_id,
        username: '',
        password: ''
      };
    }
  }
}

export const credentialsService = new CredentialsService();
