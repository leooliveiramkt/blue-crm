
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
import { Award, TrendingUp, Filter } from "lucide-react";
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
    <Card className="overflow-hidden border-none shadow-lg bg-gradient-to-br from-background to-blue-900/5">
      <CardHeader className="flex flex-row items-center justify-between bg-gradient-to-r from-background to-background/80 pb-6 border-b">
        <CardTitle className="flex items-center text-xl">
          <Award className="mr-2 h-5 w-5 text-primary" />
          Ranking Geral (Todos os tempos)
        </CardTitle>
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <Select value={selectedType} onValueChange={setSelectedType}>
            <SelectTrigger className="w-[180px] border-primary/20 bg-background">
              <SelectValue placeholder="Filtrar por tipo" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos os produtos</SelectItem>
              <SelectItem value="physical">Produtos Físicos</SelectItem>
              <SelectItem value="digital">Produtos Digitais</SelectItem>
            </SelectContent>
          </Select>
        </div>
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
            {sortedData.length > 0 ? (
              sortedData.map((item, index) => (
                <TableRow key={`${item.affiliate_id}-${index}`} className={index < 3 ? 'bg-muted/10' : ''}>
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
                    <Award className="h-12 w-12 mb-2 opacity-20" />
                    <p className="text-lg">Nenhum dado de venda registrado</p>
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

export default OverallRankingTab;
