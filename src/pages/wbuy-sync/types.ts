
/**
 * Tipo para o status de sincronização
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
    start_date?: string;
    end_date?: string;
    error?: string;
  };
}

/**
 * Interface para estatísticas
 */
export interface SyncStats {
  id: string;
  period_type: 'year' | 'month' | 'day';
  period_value: string;
  total_orders: number;
  total_revenue: number;
  total_affiliates?: number;
  product_distribution?: Record<string, number>;
  payment_methods_distribution?: Record<string, number>;
  affiliate_distribution?: Record<string, number>;
}

/**
 * Interface para estatísticas recentes
 */
export interface LatestStats {
  year: SyncStats | null;
  month: SyncStats | null;
}
