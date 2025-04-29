
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import { RankingItem } from '../../wbuy-affiliation/types';

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

export const useAffiliatesData = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [affiliates, setAffiliates] = useState<Affiliate[]>([]);
  const [weeklyPhysicalRanking, setWeeklyPhysicalRanking] = useState<RankingItem[]>([]);
  const [weeklyDigitalRanking, setWeeklyDigitalRanking] = useState<RankingItem[]>([]);
  const [monthlyRanking, setMonthlyRanking] = useState<RankingItem[]>([]);
  const [overallRanking, setOverallRanking] = useState<RankingItem[]>([]);
  const { toast } = useToast();

  const generateAffiliateData = () => {
    // Dados de afiliados simulados
    const mockAffiliates: Affiliate[] = [
      {
        id: '1',
        full_name: 'João Silva',
        email: 'joao.silva@example.com',
        status: 'active',
        experience_level: 'avançado',
        registration_date: '2024-01-15',
        target_reached: true,
        commission_rate: '15%',
        region: 'Sudeste',
        products_sold: 78
      },
      {
        id: '2',
        full_name: 'Maria Oliveira',
        email: 'maria.oliveira@example.com',
        status: 'vip',
        experience_level: 'especialista',
        registration_date: '2023-08-20',
        target_reached: true,
        commission_rate: '18%',
        region: 'Sul',
        products_sold: 125
      },
      {
        id: '3',
        full_name: 'Carlos Santos',
        email: 'carlos.santos@example.com',
        status: 'inactive',
        experience_level: 'intermediário',
        registration_date: '2023-11-05',
        target_reached: false,
        commission_rate: '10%',
        region: 'Norte',
        products_sold: 32
      },
      {
        id: '4',
        full_name: 'Ana Paula Ferreira',
        email: 'ana.ferreira@example.com',
        status: 'new',
        experience_level: 'iniciante',
        registration_date: '2024-04-01',
        target_reached: false,
        commission_rate: '10%',
        region: 'Nordeste',
        products_sold: 8
      },
      {
        id: '5',
        full_name: 'Marcos Pereira',
        email: 'marcos.pereira@example.com',
        status: 'active',
        experience_level: 'intermediário',
        registration_date: '2023-12-10',
        target_reached: true,
        commission_rate: '12%',
        region: 'Centro-Oeste',
        products_sold: 54
      },
      {
        id: '6',
        full_name: 'Juliana Costa',
        email: 'juliana.costa@example.com',
        status: 'active',
        experience_level: 'avançado',
        registration_date: '2023-09-22',
        target_reached: true,
        commission_rate: '15%',
        region: 'Sudeste',
        products_sold: 87
      },
      {
        id: '7',
        full_name: 'Roberto Almeida',
        email: 'roberto.almeida@example.com',
        status: 'potential',
        experience_level: 'intermediário',
        registration_date: '2024-02-18',
        target_reached: false,
        commission_rate: '10%',
        region: 'Sul',
        products_sold: 23
      },
      {
        id: '8',
        full_name: 'Patrícia Lima',
        email: 'patricia.lima@example.com',
        status: 'vip',
        experience_level: 'especialista',
        registration_date: '2023-06-30',
        target_reached: true,
        commission_rate: '20%',
        region: 'Nordeste',
        products_sold: 156
      }
    ];

    // Ranking semanal - produtos físicos
    const mockWeeklyPhysicalRanking: RankingItem[] = [
      {
        affiliate_id: '2',
        full_name: 'Maria Oliveira',
        total_sales: 24,
        total_sale_amount: 12800.00,
        total_commission: 2304.00,
        product_type: 'physical'
      },
      {
        affiliate_id: '8',
        full_name: 'Patrícia Lima',
        total_sales: 18,
        total_sale_amount: 9600.00,
        total_commission: 1920.00,
        product_type: 'physical'
      },
      {
        affiliate_id: '6',
        full_name: 'Juliana Costa',
        total_sales: 15,
        total_sale_amount: 6750.00,
        total_commission: 1012.50,
        product_type: 'physical'
      },
      {
        affiliate_id: '1',
        full_name: 'João Silva',
        total_sales: 12,
        total_sale_amount: 5400.00,
        total_commission: 810.00,
        product_type: 'physical'
      },
      {
        affiliate_id: '5',
        full_name: 'Marcos Pereira',
        total_sales: 9,
        total_sale_amount: 4050.00,
        total_commission: 486.00,
        product_type: 'physical'
      }
    ];

    // Ranking semanal - produtos digitais
    const mockWeeklyDigitalRanking: RankingItem[] = [
      {
        affiliate_id: '8',
        full_name: 'Patrícia Lima',
        total_sales: 32,
        total_sale_amount: 6400.00,
        total_commission: 1280.00,
        product_type: 'digital'
      },
      {
        affiliate_id: '2',
        full_name: 'Maria Oliveira',
        total_sales: 28,
        total_sale_amount: 5600.00,
        total_commission: 1008.00,
        product_type: 'digital'
      },
      {
        affiliate_id: '1',
        full_name: 'João Silva',
        total_sales: 21,
        total_sale_amount: 4200.00,
        total_commission: 630.00,
        product_type: 'digital'
      },
      {
        affiliate_id: '6',
        full_name: 'Juliana Costa',
        total_sales: 18,
        total_sale_amount: 3600.00,
        total_commission: 540.00,
        product_type: 'digital'
      },
      {
        affiliate_id: '4',
        full_name: 'Ana Paula Ferreira',
        total_sales: 4,
        total_sale_amount: 800.00,
        total_commission: 80.00,
        product_type: 'digital'
      }
    ];

    // Ranking mensal
    const mockMonthlyRanking: RankingItem[] = [
      {
        affiliate_id: '8',
        full_name: 'Patrícia Lima',
        total_sales: 145,
        total_sale_amount: 52000.00,
        total_commission: 10400.00,
        product_type: 'mixed'
      },
      {
        affiliate_id: '2',
        full_name: 'Maria Oliveira',
        total_sales: 123,
        total_sale_amount: 45000.00,
        total_commission: 8100.00,
        product_type: 'mixed'
      },
      {
        affiliate_id: '6',
        full_name: 'Juliana Costa',
        total_sales: 98,
        total_sale_amount: 39200.00,
        total_commission: 5880.00,
        product_type: 'mixed'
      },
      {
        affiliate_id: '1',
        full_name: 'João Silva',
        total_sales: 87,
        total_sale_amount: 34800.00,
        total_commission: 5220.00,
        product_type: 'mixed'
      },
      {
        affiliate_id: '5',
        full_name: 'Marcos Pereira',
        total_sales: 65,
        total_sale_amount: 26000.00,
        total_commission: 3120.00,
        product_type: 'mixed'
      }
    ];

    // Ranking geral
    const mockOverallRanking: RankingItem[] = [
      {
        affiliate_id: '8',
        full_name: 'Patrícia Lima',
        total_sales: 1250,
        total_sale_amount: 425000.00,
        total_commission: 85000.00,
        product_type: 'mixed'
      },
      {
        affiliate_id: '2',
        full_name: 'Maria Oliveira',
        total_sales: 1100,
        total_sale_amount: 385000.00,
        total_commission: 69300.00,
        product_type: 'mixed'
      },
      {
        affiliate_id: '6',
        full_name: 'Juliana Costa',
        total_sales: 872,
        total_sale_amount: 348800.00,
        total_commission: 52320.00,
        product_type: 'mixed'
      },
      {
        affiliate_id: '1',
        full_name: 'João Silva',
        total_sales: 784,
        total_sale_amount: 313600.00,
        total_commission: 47040.00,
        product_type: 'mixed'
      },
      {
        affiliate_id: '5',
        full_name: 'Marcos Pereira',
        total_sales: 548,
        total_sale_amount: 219200.00,
        total_commission: 26304.00,
        product_type: 'mixed'
      }
    ];

    return {
      affiliates: mockAffiliates,
      weeklyPhysicalRanking: mockWeeklyPhysicalRanking,
      weeklyDigitalRanking: mockWeeklyDigitalRanking,
      monthlyRanking: mockMonthlyRanking,
      overallRanking: mockOverallRanking
    };
  };

  const fetchData = async () => {
    setIsLoading(true);
    try {
      // Usamos dados simulados em vez de buscar do Supabase
      const {
        affiliates: mockAffiliates,
        weeklyPhysicalRanking: mockWeeklyPhysicalRanking,
        weeklyDigitalRanking: mockWeeklyDigitalRanking,
        monthlyRanking: mockMonthlyRanking,
        overallRanking: mockOverallRanking
      } = generateAffiliateData();

      // Aplicamos um pequeno delay para simular uma chamada à API
      await new Promise(resolve => setTimeout(resolve, 800));

      setAffiliates(mockAffiliates);
      setWeeklyPhysicalRanking(mockWeeklyPhysicalRanking);
      setWeeklyDigitalRanking(mockWeeklyDigitalRanking);
      setMonthlyRanking(mockMonthlyRanking);
      setOverallRanking(mockOverallRanking);
      
      toast({
        title: "Dados carregados",
        description: "Dados de afiliados atualizados com sucesso",
      });

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
