
// Utilitários e constantes gerais para a função wbuy-sync

// Cabeçalhos CORS para uso em todas as respostas
export const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Configurações da API Wbuy
export const WBUY_API_URL = 'https://sistema.sistemawbuy.com.br/api/v1';
export const WBUY_STORE_ID = 'f9d1cd0e-2826-4b79-897b-a2169ccf7f9e';
export const WBUY_API_TOKEN = 'ZjlkMWNkMGUtMjgyNi00Yjc5LTg5N2ItYTIxNjljY2Y3ZjllOmI3ZDU3Yjk4ZmUxMzRjOWY5OGI1NmM2Zjg3YjRjNTA3';

// Função para formatar data para ISO string
export function formatDate(date: Date): string {
  return date.toISOString();
}

// Função para tratamento de erros
export function handleError(error: any, defaultMessage: string = 'Erro desconhecido'): { message: string, stack?: string } {
  return {
    message: error instanceof Error ? error.message : defaultMessage,
    stack: error instanceof Error ? error.stack : undefined
  };
}
