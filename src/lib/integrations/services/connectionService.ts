
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
    console.log(`[ConnectionService] Iniciando teste de conexão para ${integrationId}`);
    
    const config = getIntegrationConfig(integrationId);
    if (!config) {
      console.error(`[ConnectionService] Configuração não encontrada para ${integrationId}`);
      return false;
    }

    // Verificação especial para Wbuy
    if (integrationId === 'wbuy') {
      console.log(`[ConnectionService] Testando conexão com Wbuy:`, {
        campos: Object.keys(credentials),
        domain: credentials.domain,
        storeId: credentials.storeId
      });
      return this.testWbuyConnection(credentials);
    }

    // Implementação simulada para outras integrações
    return new Promise((resolve) => {
      console.log(`[ConnectionService] Testando conexão para ${integrationId}`);
      setTimeout(() => {
        // Simula sucesso se todas as credenciais necessárias estiverem presentes
        const allFieldsFilled = config.requiredFields.every(
          field => field.required ? !!credentials[field.name] : true
        );
        console.log(`[ConnectionService] Resultado do teste para ${integrationId}: ${allFieldsFilled}`);
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
      console.error(`[ConnectionService] Campos obrigatórios faltando para Wbuy: ${missingFields.join(', ')}`);
      return false;
    }

    console.log(`[ConnectionService] Todos os campos obrigatórios para Wbuy estão presentes`);

    // Verificar se a apiKey começa com "Bearer "
    if (!credentials.apiKey.trim().startsWith('Bearer ')) {
      console.error('[ConnectionService] Token de autorização inválido: deve começar com "Bearer "');
      return false;
    }

    // Verificar se o domínio é válido
    const isValidDomain = credentials.domain && (
      credentials.domain.startsWith('http://') || 
      credentials.domain.startsWith('https://')
    );
    
    if (!isValidDomain) {
      console.error(`[ConnectionService] Domínio inválido para Wbuy: ${credentials.domain}`);
      return false;
    }
    
    // Tentar fazer uma chamada real para validar as credenciais
    try {
      console.log("[ConnectionService] Simulando conexão à API Wbuy com credenciais:", {
        domain: credentials.domain,
        storeId: credentials.storeId,
        username: credentials.username,
        // Ocultando dados sensíveis do log
        apiKey: credentials.apiKey.substring(0, 15) + "...",
        hasPassword: !!credentials.password
      });
      
      // Aqui poderíamos fazer uma chamada real à API Wbuy para validar as credenciais
      // Por enquanto, vamos apenas verificar o formato das credenciais
      
      return true; // Simulando conexão bem-sucedida
    } catch (error) {
      console.error("[ConnectionService] Erro ao testar conexão com Wbuy:", error);
      return false;
    }
  }
}

export const connectionService = new ConnectionService();
