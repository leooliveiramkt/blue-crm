
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';

interface Affiliate {
  id: string;
  full_name: string;
  email: string;
  status: string;
  experience_level: string;
  registration_date: string;
  target_reached: boolean;
  [key: string]: any;
}

export interface RankingItem {
  affiliate_id: string;
  full_name: string;
  total_sales: number;
  total_sale_amount: number;
  total_commission: number;
  product_type?: string;
}

export const useAffiliatesData = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [affiliates, setAffiliates] = useState<Affiliate[]>([]);
  const [weeklyPhysicalRanking, setWeeklyPhysicalRanking] = useState<RankingItem[]>([]);
  const [weeklyDigitalRanking, setWeeklyDigitalRanking] = useState<RankingItem[]>([]);
  const [monthlyRanking, setMonthlyRanking] = useState<RankingItem[]>([]);
  const [overallRanking, setOverallRanking] = useState<RankingItem[]>([]);
  const { toast } = useToast();

  const fetchData = async () => {
    setIsLoading(true);
    try {
      // Buscar afiliados
      const { data: affiliatesData, error: affiliatesError } = await supabase
        .from('affiliates')
        .select('*')
        .order('created_at', { ascending: false });

      if (affiliatesError) throw affiliatesError;
      setAffiliates(affiliatesData || []);

      // Buscar ranking semanal - produtos físicos
      const { data: weeklyPhysicalData, error: weeklyPhysicalError } = await supabase
        .from('weekly_physical_ranking')
        .select('*');

      if (weeklyPhysicalError) throw weeklyPhysicalError;
      setWeeklyPhysicalRanking(weeklyPhysicalData || []);

      // Buscar ranking semanal - produtos digitais
      const { data: weeklyDigitalData, error: weeklyDigitalError } = await supabase
        .from('weekly_digital_ranking')
        .select('*');

      if (weeklyDigitalError) throw weeklyDigitalError;
      setWeeklyDigitalRanking(weeklyDigitalData || []);

      // Buscar ranking mensal
      const { data: monthlyData, error: monthlyError } = await supabase
        .from('monthly_ranking')
        .select('*');

      if (monthlyError) throw monthlyError;
      setMonthlyRanking(monthlyData || []);

      // Buscar ranking geral
      const { data: overallData, error: overallError } = await supabase
        .from('overall_ranking')
        .select('*');

      if (overallError) throw overallError;
      setOverallRanking(overallData || []);

    } catch (error) {
      console.error('Erro ao carregar dados de afiliados:', error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar os dados de afiliados",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return {
    isLoading,
    affiliates,
    weeklyPhysicalRanking,
    weeklyDigitalRanking,
    monthlyRanking,
    overallRanking,
    refreshData: fetchData
  };
};
