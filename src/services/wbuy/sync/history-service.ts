
import { supabase } from '@/lib/supabase';

/**
 * Serviço para gerenciar histórico de sincronizações
 */
export class WbuySyncHistoryService {
  /**
   * Busca o status de uma sincronização específica
   * @param syncId ID da sincronização
   */
  async getSyncStatus(syncId: string) {
    try {
      const { data, error } = await supabase
        .from('wbuy_sync_status')
        .select('*')
        .eq('id', syncId)
        .single();

      if (error) {
        throw error;
      }

      return data;
    } catch (error) {
      console.error('Erro ao buscar status da sincronização:', error);
      throw error;
    }
  }

  /**
   * Busca o histórico de sincronizações
   * @param limit Limite de registros (padrão: 10)
   */
  async getSyncHistory(limit: number = 10) {
    try {
      const { data, error } = await supabase
        .from('wbuy_sync_status')
        .select('*')
        .order('last_sync', { ascending: false })
        .limit(limit);

      if (error) {
        throw error;
      }

      return data || [];
    } catch (error) {
      console.error('Erro ao buscar histórico de sincronização:', error);
      return [];
    }
  }

  /**
   * Busca informações da última sincronização
   */
  async getLastSync() {
    try {
      const { data, error } = await supabase
        .from('wbuy_sync_status')
        .select('*')
        .order('last_sync', { ascending: false })
        .limit(1)
        .single();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      return data || null;
    } catch (error) {
      console.error('Erro ao buscar última sincronização:', error);
      return null;
    }
  }
}
