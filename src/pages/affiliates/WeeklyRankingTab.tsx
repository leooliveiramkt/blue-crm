
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

interface RankingItem {
  affiliate_id: string;
  full_name: string;
  total_sales: number;
  total_sale_amount: number;
  total_commission: number;
}

interface WeeklyRankingTabProps {
  title: string;
  rankingData: RankingItem[];
  type: 'physical' | 'digital';
}

const WeeklyRankingTab: React.FC<WeeklyRankingTabProps> = ({ title, rankingData, type }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          {type === 'physical' ? (
            <BadgeCheck className="mr-2 h-5 w-5" />
          ) : (
            <TrendingUp className="mr-2 h-5 w-5" />
          )}
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12">Posição</TableHead>
              <TableHead>Afiliado</TableHead>
              <TableHead className="text-right">Vendas</TableHead>
              <TableHead className="text-right">Valor Total</TableHead>
              <TableHead className="text-right">Comissão</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rankingData.length > 0 ? (
              rankingData.map((item, index) => (
                <TableRow key={item.affiliate_id}>
                  <TableCell>
                    <div className="flex justify-center items-center">
                      {index < 3 ? (
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center 
                          ${index === 0 ? 'bg-yellow-100 text-yellow-700' : 
                            index === 1 ? 'bg-gray-100 text-gray-700' : 
                            'bg-orange-100 text-orange-700'}`}>
                          <Award className="h-5 w-5" />
                        </div>
                      ) : (
                        <Badge variant="outline">{index + 1}º</Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="font-medium">{item.full_name}</TableCell>
                  <TableCell className="text-right">{item.total_sales}</TableCell>
                  <TableCell className="text-right">
                    R$ {item.total_sale_amount.toLocaleString('pt-BR', {minimumFractionDigits: 2})}
                  </TableCell>
                  <TableCell className="text-right">
                    R$ {item.total_commission.toLocaleString('pt-BR', {minimumFractionDigits: 2})}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                  Nenhum dado de venda registrado na semana atual
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
