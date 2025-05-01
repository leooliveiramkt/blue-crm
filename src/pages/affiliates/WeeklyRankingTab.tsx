
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Award, TrendingUp, BadgeCheck } from "lucide-react";
import { RankingItem } from '../wbuy-affiliation/types';

interface WeeklyRankingTabProps {
  title: string;
  rankingData: RankingItem[];
  type: 'physical' | 'digital';
}

const WeeklyRankingTab: React.FC<WeeklyRankingTabProps> = ({ title, rankingData, type }) => {
  return (
    <Card className="overflow-hidden border-none shadow-lg bg-gradient-to-br from-background to-secondary/5">
      <CardHeader className="bg-gradient-to-r from-background to-background/80 pb-6 border-b">
        <CardTitle className="flex items-center text-xl">
          {type === 'physical' ? (
            <BadgeCheck className="mr-2 h-5 w-5 text-primary" />
          ) : (
            <TrendingUp className="mr-2 h-5 w-5 text-primary" />
          )}
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <Table>
          <TableHeader className="bg-muted/30">
            <TableRow>
              <TableHead className="w-20 text-center">Posição</TableHead>
              <TableHead>Afiliado</TableHead>
              <TableHead className="text-right">Vendas</TableHead>
              <TableHead className="text-right">Valor Total</TableHead>
              <TableHead className="text-right">Comissão</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rankingData.length > 0 ? (
              rankingData.map((item, index) => (
                <TableRow key={item.affiliate_id} className={index < 3 ? 'bg-muted/10' : ''}>
                  <TableCell className="text-center">
                    <div className="flex justify-center items-center">
                      {index < 3 ? (
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center 
                          ${index === 0 ? 'bg-yellow-100 text-yellow-700 border-2 border-yellow-300' : 
                            index === 1 ? 'bg-gray-100 text-gray-700 border-2 border-gray-300' : 
                            'bg-orange-100 text-orange-700 border-2 border-orange-300'}`}>
                          <Award className="h-6 w-6" />
                        </div>
                      ) : (
                        <Badge variant="outline" className="h-7 w-7 rounded-full flex items-center justify-center font-bold p-0 border-2">{index + 1}</Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="font-medium">{item.full_name}</TableCell>
                  <TableCell className="text-right font-mono">{item.total_sales}</TableCell>
                  <TableCell className="text-right font-mono">
                    R$ {item.total_sale_amount.toLocaleString('pt-BR', {minimumFractionDigits: 2})}
                  </TableCell>
                  <TableCell className="text-right font-mono text-primary">
                    R$ {item.total_commission.toLocaleString('pt-BR', {minimumFractionDigits: 2})}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-12 text-muted-foreground">
                  <div className="flex flex-col items-center">
                    <TrendingUp className="h-12 w-12 mb-2 opacity-20" />
                    <p className="text-lg">Nenhum dado de venda registrado na semana atual</p>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default WeeklyRankingTab;
