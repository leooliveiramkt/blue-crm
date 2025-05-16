
import { IntegrationType } from '../types';
import { getIntegrationConfig } from '../configs';

/**
 * Serviço para testar conexões com APIs externas
 */
export class ConnectionService {
  /**
   * Testa uma conexão de API com base nas credenciais fornecidas
   */
  public async testConnection(integrationId: IntegrationType, credentials: Record<string, string>): Promise<boolean> {
    console.log(`[ConnectionService] Iniciando teste de conexão para ${integrationId}`);
    console.log(`[ConnectionService] Credenciais fornecidas:`, {
      campos: Object.keys(credentials),
      temApiKey: !!credentials.apiKey,
      temSenha: !!credentials.password,
      temDomain: !!credentials.domain,
      domain: credentials.domain
    });
    
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
        storeId: credentials.storeId,
        username: credentials.username,
        apiKeyLength: credentials.apiKey?.length
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
   * Implementado conforme documentação: https://documenter.getpostman.com/view/4141833/RWTsquyN
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
    const apiKey = credentials.apiKey.trim();
    if (!apiKey.startsWith('Bearer ')) {
      console.error('[ConnectionService] Token de autorização inválido: deve começar com "Bearer "');
      // Tentamos corrigir automaticamente
      credentials.apiKey = `Bearer ${apiKey}`;
      console.log('[ConnectionService] Token corrigido para incluir "Bearer "');
    }
    console.log('[ConnectionService] Token de autorização válido (começa com "Bearer ")');

    // Verificar se o domínio é válido
    const isValidDomain = credentials.domain && (
      credentials.domain.startsWith('http://') || 
      credentials.domain.startsWith('https://')
    );
    
    if (!isValidDomain) {
      console.error(`[ConnectionService] Domínio inválido para Wbuy: ${credentials.domain}`);
      return false;
    }
    console.log(`[ConnectionService] Domínio válido: ${credentials.domain}`);
    
    // Fazer uma chamada real à API para verificar as credenciais
    // Conforme documentação Wbuy, usar endpoint de "settings" que é leve e adequado para teste
    try {
      console.log("[ConnectionService] Testando conexão à API Wbuy com credenciais:", {
        domain: credentials.domain,
        storeId: credentials.storeId,
        username: credentials.username,
        // Ocultando dados sensíveis do log
        apiKey: credentials.apiKey.substring(0, 15) + "...",
        hasPassword: !!credentials.password
      });
      
      const testEndpoint = `${credentials.domain}/settings`;
      
      const response = await fetch(testEndpoint, {
        method: 'GET',
        headers: {
          'Authorization': credentials.apiKey,
          'Content-Type': 'application/json',
          'X-Store-ID': credentials.storeId,
        }
      });
      
      if (!response.ok) {
        console.error(`[ConnectionService] Falha na verificação: ${response.status} ${response.statusText}`);
        
        // Log detalhado baseado no código de erro da API Wbuy
        if (response.status === 401) {
          console.error('[ConnectionService] Falha de autenticação: Token inválido ou expirado');
        } else if (response.status === 403) {
          console.error('[ConnectionService] Permissão negada: Verifique as permissões da credencial');
        } else if (response.status === 404) {
          console.error('[ConnectionService] Endpoint não encontrado. Verifique o domain/URL');
        }
        
        return false;
      }
      
      // Tentando ler o corpo da resposta para verificar formato
      const data = await response.json();
      console.log("[ConnectionService] Resposta da API Wbuy:", data ? "Dados recebidos" : "Sem dados");
      
      return true; // Conexão bem-sucedida
    } catch (error) {
      console.error("[ConnectionService] Erro ao testar conexão com Wbuy:", error);
      return false;
    }
  }
}

export const connectionService = new ConnectionService();
