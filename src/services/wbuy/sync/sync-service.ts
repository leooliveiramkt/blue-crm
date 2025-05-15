
import { supabase } from '@/lib/supabase';
import { toast } from '@/hooks/use-toast';
import { OrderFilters, OrdersResult, LatestStats } from './types';

/**
 * Serviço para sincronização de dados da Wbuy
 */
export class WbuySyncService {
  /**
   * Inicia a sincronização de dados da Wbuy
   * @param fullSync Se true, busca todos os dados históricos
   * @param startDate Data inicial (opcional)
   * @param endDate Data final (opcional)
   */
  async startSync(fullSync: boolean = false, startDate?: string, endDate?: string): Promise<{ success: boolean, message: string, syncId?: string }> {
    try {
      // Construir a URL da função Edge
      let url = `https://zkjpzwrcuauieaaktzbk.supabase.co/functions/v1/wbuy-sync?fullSync=${fullSync}`;
      
      // Adicionar datas se fornecidas
      if (startDate) url += `&startDate=${encodeURIComponent(startDate)}`;
      if (endDate) url += `&endDate=${encodeURIComponent(endDate)}`;
      
      // Obter a chave anon do Supabase
      const { data: { session } } = await supabase.auth.getSession();
      const headers: HeadersInit = {
        'Content-Type': 'application/json',
      };

      // Adicionar Authorization header se houver sessão
      if (session?.access_token) {
        headers['Authorization'] = `Bearer ${session.access_token}`;
      }

      // Chamar a função Edge
      const response = await fetch(url, {
        method: 'POST',
        headers
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Erro na sincronização: ${response.status} - ${errorText}`);
      }

      const result = await response.json();

      if (result.success) {
        toast({
          title: "Sincronização iniciada",
          description: `${result.summary}`,
          variant: "default"
        });
        
        return {
          success: true,
          message: result.summary,
          syncId: result.syncId
        };
      } else {
        throw new Error(result.error || 'Erro desconhecido durante a sincronização');
      }
    } catch (error) {
      console.error('Erro ao iniciar sincronização:', error);
      
      toast({
        title: "Erro na sincronização",
        description: error instanceof Error ? error.message : 'Erro desconhecido',
        variant: "destructive"
      });
      
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Erro desconhecido'
      };
    }
  }

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
   * Busca estatísticas da Wbuy por período
   * @param periodType Tipo de período ('year', 'month', 'day')
   */
  async getStatsByPeriod(periodType: 'year' | 'month' | 'day') {
    try {
      const { data, error } = await supabase
        .from('wbuy_stats')
        .select('*')
        .eq('period_type', periodType)
        .order('period_value', { ascending: false });

      if (error) {
        throw error;
      }

      return data || [];
    } catch (error) {
      console.error(`Erro ao buscar estatísticas por ${periodType}:`, error);
      return [];
    }
  }

  /**
   * Busca pedidos da Wbuy com filtros
   * @param filters Filtros opcionais
   * @param page Página (padrão: 1)
   * @param limit Limite de registros por página (padrão: 20)
   */
  async getOrders(filters?: OrderFilters, page: number = 1, limit: number = 20): Promise<OrdersResult> {
    try {
      // Calcula o offset baseado na página
      const offset = (page - 1) * limit;

      // Inicia a query
      let query = supabase
        .from('wbuy_orders')
        .select('*', { count: 'exact' });

      // Aplica filtros se fornecidos
      if (filters?.startDate) {
        query = query.gte('order_date', filters.startDate);
      }

      if (filters?.endDate) {
        query = query.lte('order_date', filters.endDate);
      }

      if (filters?.affiliateCode) {
        query = query.eq('affiliate_code', filters.affiliateCode);
      }

      if (filters?.status) {
        query = query.eq('status', filters.status);
      }

      if (filters?.year) {
        query = query.eq('year', filters.year);
      }

      if (filters?.month) {
        query = query.eq('month', filters.month);
      }

      // Finaliza a query com ordenação, paginação e execução
      const { data, error, count } = await query
        .order('order_date', { ascending: false })
        .range(offset, offset + limit - 1);

      if (error) {
        throw error;
      }

      return {
        data: data || [],
        total: count || 0,
        page,
        limit
      };
    } catch (error) {
      console.error('Erro ao buscar pedidos:', error);
      return {
        data: [],
        total: 0,
        page,
        limit
      };
    }
  }

  /**
   * Busca últimas estatísticas disponíveis
   */
  async getLatestStats(): Promise<LatestStats> {
    try {
      // Obtém estatísticas do ano atual
      const currentYear = new Date().getFullYear();
      const { data: yearStats, error: yearError } = await supabase
        .from('wbuy_stats')
        .select('*')
        .eq('period_type', 'year')
        .eq('period_value', currentYear.toString())
        .single();

      if (yearError && yearError.code !== 'PGRST116') {
        console.error('Erro ao buscar estatísticas do ano:', yearError);
      }

      // Obtém estatísticas do mês atual
      const currentMonth = new Date().getMonth() + 1;
      const monthValue = `${currentYear}-${currentMonth < 10 ? '0' + currentMonth : currentMonth}`;
      const { data: monthStats, error: monthError } = await supabase
        .from('wbuy_stats')
        .select('*')
        .eq('period_type', 'month')
        .eq('period_value', monthValue)
        .single();

      if (monthError && monthError.code !== 'PGRST116') {
        console.error('Erro ao buscar estatísticas do mês:', monthError);
      }

      return {
        year: yearStats || null,
        month: monthStats || null
      };
    } catch (error) {
      console.error('Erro ao buscar estatísticas recentes:', error);
      return { year: null, month: null };
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

export const wbuySyncService = new WbuySyncService();
