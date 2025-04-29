
import React, { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Users, BadgeCheck, Award, TrendingUp } from "lucide-react";
import AffiliatesTable from './AffiliatesTable';

interface Affiliate {
  id: string;
  full_name: string;
  email: string;
  status: string;
  experience_level: string;
  registration_date: string;
  target_reached: boolean;
}

interface RankingItem {
  affiliate_id: string;
  full_name: string;
  total_sales: number;
  total_sale_amount: number;
  total_commission: number;
}

interface AffiliateOverviewProps {
  affiliates: Affiliate[];
  weeklyPhysicalRanking: RankingItem[];
  weeklyDigitalRanking: RankingItem[];
  onSelectAffiliate: (id: string) => void;
}

const AffiliateOverview: React.FC<AffiliateOverviewProps> = ({ 
  affiliates, 
  weeklyPhysicalRanking, 
  weeklyDigitalRanking,
  onSelectAffiliate 
}) => {
  
  const stats = useMemo(() => {
    const totalAffiliates = affiliates.length;
    const activeAffiliates = affiliates.filter(a => a.status === 'active' || a.status === 'vip').length;
    const newAffiliates = affiliates.filter(a => {
      const registrationDate = new Date(a.registration_date);
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      return registrationDate >= thirtyDaysAgo;
    }).length;
    const targetReached = affiliates.filter(a => a.target_reached).length;

    return {
      totalAffiliates,
      activeAffiliates,
      newAffiliates,
      targetReached
    };
  }, [affiliates]);

  const topPerformers = useMemo(() => {
    // Combinar rankings e pegar os top 5 afiliados por vendas totais
    const combined = [...weeklyPhysicalRanking, ...weeklyDigitalRanking];
    const affiliateMap = new Map();
    
    combined.forEach(item => {
      if (affiliateMap.has(item.affiliate_id)) {
        const existing = affiliateMap.get(item.affiliate_id);
        affiliateMap.set(item.affiliate_id, {
          ...item,
          total_sales: existing.total_sales + item.total_sales,
          total_sale_amount: existing.total_sale_amount + item.total_sale_amount,
          total_commission: existing.total_commission + item.total_commission,
        });
      } else {
        affiliateMap.set(item.affiliate_id, item);
      }
    });
    
    return Array.from(affiliateMap.values())
      .sort((a, b) => b.total_sale_amount - a.total_sale_amount)
      .slice(0, 5);
  }, [weeklyPhysicalRanking, weeklyDigitalRanking]);

  return (
    <div className="space-y-6">
      {/* Métricas */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Afiliados</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalAffiliates}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Afiliados Ativos</CardTitle>
            <BadgeCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.activeAffiliates}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Novos (30 dias)</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.newAffiliates}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Metas Batidas</CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.targetReached}</div>
          </CardContent>
        </Card>
      </div>

      {/* Top Performers */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Top Performers da Semana</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {topPerformers.map((performer, index) => (
              <div key={performer.affiliate_id} className="flex items-center">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center mr-3">
                  <span className="font-bold">{index + 1}</span>
                </div>
                <div className="flex-1">
                  <h4 className="font-medium">{performer.full_name}</h4>
                  <div className="text-sm text-muted-foreground flex items-center">
                    <TrendingUp className="h-3 w-3 mr-1" />
                    R$ {performer.total_sale_amount.toLocaleString('pt-BR', {minimumFractionDigits: 2})}
                  </div>
                </div>
                <Button variant="outline" size="sm" onClick={() => onSelectAffiliate(performer.affiliate_id)}>
                  Ver detalhes
                </Button>
              </div>
            ))}
            
            {topPerformers.length === 0 && (
              <div className="text-center py-6 text-muted-foreground">
                Nenhuma venda registrada na semana atual
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Tabela de Afiliados */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Lista de Afiliados</CardTitle>
        </CardHeader>
        <CardContent>
          <AffiliatesTable affiliates={affiliates} onSelectAffiliate={onSelectAffiliate} />
        </CardContent>
      </Card>
    </div>
  );
};

export default AffiliateOverview;
