import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useSalesTeamData } from '../hooks/useSalesTeamData';

export const SalesRanking: React.FC = () => {
  const { salespeople } = useSalesTeamData();
  
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      <Card className="col-span-full">
        <CardHeader>
          <CardTitle>Ranking de Vendedores</CardTitle>
          <CardDescription>
            Desempenho dos vendedores no período atual
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[50px]">Posição</TableHead>
                <TableHead>Vendedor</TableHead>
                <TableHead>Vendas</TableHead>
                <TableHead>Valor Total</TableHead>
                <TableHead>% da Meta</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {salespeople.map((person, index) => (
                <TableRow key={person.id}>
                  <TableCell className="font-medium flex items-center">
                    <span className={`inline-block w-3 h-3 rounded-full mr-2 ${person.goalPercentage >= 100 ? 'bg-emerald-500' : person.goalPercentage >= 70 ? 'bg-yellow-400' : 'bg-rose-500'}`}></span>
                    {index + 1}
                  </TableCell>
                  <TableCell>{person.name}</TableCell>
                  <TableCell>{person.sales}</TableCell>
                  <TableCell>R$ {person.totalValue.toLocaleString('pt-BR')}</TableCell>
                  <TableCell>{person.goalPercentage}%</TableCell>
                  <TableCell>
                    <Badge variant={person.goalPercentage >= 100 ? "default" : 
                                   person.goalPercentage >= 70 ? "outline" : "destructive"}>
                      {person.goalPercentage >= 100 ? "Meta Atingida" : 
                       person.goalPercentage >= 70 ? "Em Andamento" : "Atenção"}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};
