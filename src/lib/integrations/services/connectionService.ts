
import { IntegrationType } from '../types';
import { getIntegrationConfig } from '../integrationConfigs';

/**
 * Serviço para testar conexões com APIs externas
 */
export class ConnectionService {
  /**
   * Testa uma conexão de API com base nas credenciais fornecidas
   */
  public async testConnection(integrationId: IntegrationType, credentials: Record<string, string>): Promise<boolean> {
    const config = getIntegrationConfig(integrationId);
    if (!config) return false;

    // Verificação especial para Wbuy
    if (integrationId === 'wbuy') {
      console.log("Testando conexão com Wbuy:", credentials);
      return this.testWbuyConnection(credentials);
    }

    // Implementação simulada para outras integrações
    return new Promise((resolve) => {
      setTimeout(() => {
        // Simula sucesso se todas as credenciais necessárias estiverem presentes
        const allFieldsFilled = config.requiredFields.every(
          field => field.required ? !!credentials[field.name] : true
        );
        resolve(allFieldsFilled);
      }, 1000);
    });
  }

  /**
   * Testa específicamente a conexão com a API da Wbuy
   */
  private async testWbuyConnection(credentials: Record<string, string>): Promise<boolean> {
    // Verifique se todos os campos obrigatórios estão presentes
    const requiredFields = ['apiKey', 'storeId', 'username', 'password', 'domain'];
    const missingFields = requiredFields.filter(field => !credentials[field]);
    
    if (missingFields.length > 0) {
      console.error("Campos obrigatórios faltando para Wbuy:", missingFields);
      return false;
    }

    // Simular uma tentativa de conexão à API
    return new Promise((resolve) => {
      console.log("Simulando conexão à API Wbuy com credenciais:", {
        domain: credentials.domain,
        storeId: credentials.storeId,
        // Ocultando dados sensíveis do log
        apiKey: "***********",
        username: credentials.username,
        hasPassword: !!credentials.password
      });
      
      setTimeout(() => {
        // Consideramos bem-sucedido se todos os campos estiverem preenchidos
        resolve(true);
      }, 1500);
    });
  }
}

export const connectionService = new ConnectionService();
