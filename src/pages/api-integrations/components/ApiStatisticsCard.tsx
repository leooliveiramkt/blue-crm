
import React from 'react';
import { formatDistanceToNow, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Loader2 } from 'lucide-react';
import { useApiStatistics } from '../hooks/useApiStatistics';
import { capitalizeFirstLetter } from '../utils';

const ApiStatisticsCard: React.FC = () => {
  const { stats, isLoading } = useApiStatistics();

  const formatLastCall = (lastCallDate: string | null) => {
    if (!lastCallDate) return 'Nunca';
    
    try {
      return formatDistanceToNow(parseISO(lastCallDate), { 
        addSuffix: true,
        locale: ptBR
      });
    } catch (error) {
      return 'Data inválida';
    }
  };

  const getSuccessRateBadge = (rate: number) => {
    if (rate >= 99) return <Badge className="bg-green-100 text-green-800">Excelente</Badge>;
    if (rate >= 95) return <Badge className="bg-blue-100 text-blue-800">Boa</Badge>;
    if (rate >= 90) return <Badge className="bg-yellow-100 text-yellow-800">Regular</Badge>;
    return <Badge className="bg-red-100 text-red-800">Baixa</Badge>;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Estatísticas de API (últimas 24h)</CardTitle>
        <CardDescription>
          Monitoramento de desempenho das chamadas de API para cada integração
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex justify-center py-6">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        ) : stats.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Integração</TableHead>
                <TableHead className="text-right">Total de Chamadas</TableHead>
                <TableHead className="text-right">Taxa de Sucesso</TableHead>
                <TableHead className="text-right">Tempo Médio</TableHead>
                <TableHead className="text-right">Última Chamada</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {stats.map((stat) => (
                <TableRow key={stat.integrationId}>
                  <TableCell className="font-medium">
                    {capitalizeFirstLetter(stat.integrationId)}
                  </TableCell>
                  <TableCell className="text-right">{stat.totalCalls}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      {stat.successRate.toFixed(1)}%
                      {getSuccessRateBadge(stat.successRate)}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">{stat.avgResponseTime}ms</TableCell>
                  <TableCell className="text-right">{formatLastCall(stat.lastCall)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <div className="py-6 text-center text-muted-foreground">
            Nenhuma estatística disponível
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ApiStatisticsCard;
