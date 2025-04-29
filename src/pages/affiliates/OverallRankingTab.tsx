import React, { useState } from 'react';
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
import { Award, TrendingUp } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RankingItem } from '../wbuy-affiliation/types';

interface OverallRankingTabProps {
  rankingData: RankingItem[];
}

const OverallRankingTab: React.FC<OverallRankingTabProps> = ({ rankingData }) => {
  const [selectedType, setSelectedType] = useState<string>("all");
  
  const filteredData = selectedType === "all" 
    ? rankingData 
    : rankingData.filter(item => item.product_type === selectedType);

  // Group by affiliate_id and sum up the values
  const aggregatedData = filteredData.reduce((acc, current) => {
    const existingItem = acc.find(item => item.affiliate_id === current.affiliate_id);
    
    if (existingItem) {
      existingItem.total_sales += current.total_sales;
      existingItem.total_sale_amount += current.total_sale_amount;
      existingItem.total_commission += current.total_commission;
    } else {
      acc.push({...current});
    }
    
    return acc;
  }, [] as RankingItem[]);
  
  // Sort by total_sale_amount
  const sortedData = [...aggregatedData].sort((a, b) => b.total_sale_amount - a.total_sale_amount);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center">
          <TrendingUp className="mr-2 h-5 w-5" />
          Ranking Geral (Todos os tempos)
        </CardTitle>
        <Select value={selectedType} onValueChange={setSelectedType}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filtrar por tipo" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos os produtos</SelectItem>
            <SelectItem value="physical">Produtos Físicos</SelectItem>
            <SelectItem value="digital">Produtos Digitais</SelectItem>
          </SelectContent>
        </Select>
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
            {sortedData.length > 0 ? (
              sortedData.map((item, index) => (
                <TableRow key={`${item.affiliate_id}-${index}`}>
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
                  Nenhum dado de venda registrado
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default OverallRankingTab;
