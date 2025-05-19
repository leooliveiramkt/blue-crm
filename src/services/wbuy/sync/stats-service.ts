
import { supabase } from '@/lib/supabase';
import { LatestStats } from './types';

/**
 * Serviço para gerenciar estatísticas da Wbuy
 */
export class WbuySyncStatsService {
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
}
