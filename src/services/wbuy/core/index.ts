
import { apiCallService } from "./api-call";
import { credentialsService } from "./credentials";
import { Credentials } from "./credentials";

/**
 * Funções básicas para acesso à API Wbuy
 * Implementado conforme documentação: https://documenter.getpostman.com/view/4141833/RWTsquyN
 */
export class WbuyApiCore {
  /**
   * Obtém as credenciais de integração Wbuy do tenant atual
   * @returns Credenciais da API Wbuy ou credenciais padrão
   */
  getCredentials = credentialsService.getCredentials.bind(credentialsService);

  /**
   * Faz uma chamada à API Wbuy
   * @param endpoint Endpoint da API (ex: /orders, /affiliates)
   * @param method Método HTTP
   * @param body Corpo da requisição (opcional)
   * @param queryParams Parâmetros de consulta (opcional)
   * @returns Dados da resposta ou null em caso de erro
   */
  async callApi<T>(
    endpoint: string, 
    method: 'GET' | 'POST' | 'PUT' | 'DELETE' = 'GET', 
    body?: any,
    queryParams?: Record<string, string | number | boolean>
  ): Promise<T | null> {
    const credentials = await this.getCredentials();
    return apiCallService.callApi<T>(endpoint, credentials, method, body, queryParams);
  }
}

export const wbuyApiCore = new WbuyApiCore();

// Exportar tipos
export type { Credentials };
