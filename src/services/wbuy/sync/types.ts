
/**
 * Status possíveis de sincronização
 */
export type SyncStatusType = 'em_andamento' | 'processando' | 'concluido' | 'concluido_com_erros' | 'erro';

/**
 * Interface para o status da sincronização
 */
export interface SyncStatus {
  id: string;
  status: SyncStatusType;
  last_sync: string;
  total_records_processed: number;
  details?: {
    summary?: string;
    errors?: any[];
  };
}

/**
 * Interface para filtros de pedidos
 */
export interface OrderFilters {
  startDate?: string;
  endDate?: string;
  affiliateCode?: string;
  status?: string;
  year?: number;
  month?: number;
}

/**
 * Interface para resultado da paginação de pedidos
 */
export interface OrdersResult {
  data: any[];
  total: number;
  page: number;
  limit: number;
}

/**
 * Interface para estatísticas recentes
 */
export interface LatestStats {
  year: any | null;
  month: any | null;
}
