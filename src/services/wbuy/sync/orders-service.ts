
import { supabase } from '@/lib/supabase';
import { OrderFilters, OrdersResult } from './types';

/**
 * Serviço para gerenciar pedidos da Wbuy
 */
export class WbuySyncOrdersService {
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
}
