
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
        <Card className="border-none shadow-md bg-gradient-to-br from-background to-primary/5">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Afiliados</CardTitle>
            <Users className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.totalAffiliates}</div>
          </CardContent>
        </Card>
        
        <Card className="border-none shadow-md bg-gradient-to-br from-background to-green-500/5">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Afiliados Ativos</CardTitle>
            <BadgeCheck className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.activeAffiliates}</div>
          </CardContent>
        </Card>
        
        <Card className="border-none shadow-md bg-gradient-to-br from-background to-blue-500/5">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Novos (30 dias)</CardTitle>
            <Users className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.newAffiliates}</div>
          </CardContent>
        </Card>
        
        <Card className="border-none shadow-md bg-gradient-to-br from-background to-amber-500/5">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Metas Batidas</CardTitle>
            <Award className="h-4 w-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.targetReached}</div>
          </CardContent>
        </Card>
      </div>

      {/* Top Performers */}
      <Card className="border-none shadow-md overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-background to-background/80 pb-6 border-b">
          <CardTitle className="text-lg flex items-center">
            <Award className="mr-2 h-5 w-5 text-amber-500" />
            Top Performers da Semana
          </CardTitle>
        </CardHeader>
        <CardContent className="bg-gradient-to-br from-background to-amber-500/5 p-6">
          <div className="space-y-4">
            {topPerformers.map((performer, index) => (
              <div key={performer.affiliate_id} className="flex items-center p-3 rounded-lg bg-background/40 hover:bg-background/80 transition-all border border-muted">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center mr-3
                  ${index === 0 ? 'bg-yellow-100 text-yellow-700 border border-yellow-300' : 
                  index === 1 ? 'bg-gray-100 text-gray-700 border border-gray-300' : 
                  index === 2 ? 'bg-orange-100 text-orange-700 border border-orange-300' :
                  'bg-muted text-muted-foreground'}`}>
                  <span className="font-bold text-xl">{index + 1}</span>
                </div>
                <div className="flex-1">
                  <h4 className="font-medium">{performer.full_name}</h4>
                  <div className="text-sm text-muted-foreground flex items-center">
                    <TrendingUp className="h-3 w-3 mr-1" />
                    <span className="font-mono">R$ {performer.total_sale_amount.toLocaleString('pt-BR', {minimumFractionDigits: 2})}</span>
                  </div>
                </div>
                <Button variant="outline" size="sm" onClick={() => onSelectAffiliate(performer.affiliate_id)} className="ml-2">
                  Ver detalhes
                </Button>
              </div>
            ))}
            
            {topPerformers.length === 0 && (
              <div className="text-center py-12 text-muted-foreground">
                <TrendingUp className="h-12 w-12 mx-auto mb-3 opacity-20" />
                <p className="text-lg">Nenhuma venda registrada na semana atual</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Tabela de Afiliados */}
      <Card className="border-none shadow-md overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-background to-background/80 pb-6 border-b">
          <CardTitle className="text-lg flex items-center">
            <Users className="mr-2 h-5 w-5 text-primary" />
            Lista de Afiliados
          </CardTitle>
        </CardHeader>
        <CardContent className="bg-gradient-to-br from-background to-primary/5 p-0">
          <AffiliatesTable affiliates={affiliates} onSelectAffiliate={onSelectAffiliate} />
        </CardContent>
      </Card>
    </div>
  );
};

export default AffiliateOverview;
