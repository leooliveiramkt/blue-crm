
import { Credentials } from './credentials';

/**
 * Utilitário para chamadas à API Wbuy
 */
export class ApiCallService {
  /**
   * Faz uma chamada à API Wbuy
   * @param endpoint Endpoint da API (ex: /orders, /affiliates)
   * @param credentials Credenciais da API
   * @param method Método HTTP
   * @param body Corpo da requisição (opcional)
   * @param queryParams Parâmetros de consulta (opcional)
   * @returns Dados da resposta ou null em caso de erro
   */
  async callApi<T>(
    endpoint: string,
    credentials: Credentials,
    method: 'GET' | 'POST' | 'PUT' | 'DELETE' = 'GET',
    body?: any,
    queryParams?: Record<string, string | number | boolean>
  ): Promise<T | null> {
    const { apiKey, domain, storeId } = credentials;
    
    // Construir URL com parâmetros de consulta se fornecidos
    let url = `${domain}${endpoint.startsWith('/') ? endpoint : '/' + endpoint}`;
    
    if (queryParams && Object.keys(queryParams).length > 0) {
      const params = new URLSearchParams();
      Object.entries(queryParams).forEach(([key, value]) => {
        params.append(key, String(value));
      });
      url += `?${params.toString()}`;
    }

    try {
      // Verificar token de autorização
      let authToken = apiKey;
      if (!authToken.startsWith('Bearer ')) {
        authToken = `Bearer ${authToken}`;
      }
      
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        'Authorization': authToken
      };
      
      // Adicionar cabeçalhos específicos se disponíveis
      if (storeId) {
        headers['X-Store-ID'] = storeId;
      }

      const options: RequestInit = {
        method,
        headers,
        body: body ? JSON.stringify(body) : undefined,
      };

      console.log(`Chamando Wbuy API: ${url}`, {
        método: method,
        temCorpo: !!body,
        temStoreId: !!storeId
      });
      
      const response = await fetch(url, options);
      
      // Tratamento de erros específicos da API Wbuy
      if (!response.ok) {
        const errorText = await response.text();
        let errorDetails: string;
        
        try {
          // Tentar extrair mensagem de erro da resposta JSON
          const errorJson = JSON.parse(errorText);
          errorDetails = errorJson.message || errorJson.error || errorText;
        } catch {
          errorDetails = errorText;
        }
        
        // Erros específicos da API Wbuy conforme documentação
        switch (response.status) {
          case 401:
            throw new Error(`Erro de autenticação: Token inválido ou expirado. Detalhes: ${errorDetails}`);
          case 403:
            throw new Error(`Acesso negado: Você não tem permissão para acessar este recurso. Detalhes: ${errorDetails}`);
          case 404:
            throw new Error(`Recurso não encontrado: ${endpoint}. Detalhes: ${errorDetails}`);
          case 422:
            throw new Error(`Erro de validação: ${errorDetails}`);
          case 429:
            throw new Error(`Muitas requisições: Limite de taxa excedido. Tente novamente mais tarde.`);
          case 500:
          case 502:
          case 503:
            throw new Error(`Erro no servidor Wbuy: ${response.status} ${errorDetails}`);
          default:
            throw new Error(`Erro na API Wbuy: ${response.status} ${errorDetails}`);
        }
      }

      // Tentar fazer parse da resposta como JSON
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        return await response.json() as T;
      } else {
        // Se a resposta não for JSON, retornar o texto
        const text = await response.text();
        console.warn('Resposta não-JSON da API Wbuy:', text);
        return null;
      }
    } catch (error) {
      console.error(`Erro na chamada à API Wbuy (${endpoint}):`, error);
      throw error;
    }
  }
}

export const apiCallService = new ApiCallService();
