
import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

interface StatsTabProps {
  yearlyStats: any[];
  monthlyStats: any[];
  latestStats: {
    year: any;
    month: any;
  };
}

export const StatsTab: React.FC<StatsTabProps> = ({
  yearlyStats,
  monthlyStats,
  latestStats
}) => {
  // Formata valor para moeda
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  return (
    <>
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Estatísticas Anuais</CardTitle>
            <CardDescription>
              Resumo de vendas por ano
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {yearlyStats.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Ano</TableHead>
                      <TableHead>Pedidos</TableHead>
                      <TableHead>Receita</TableHead>
                      <TableHead>Afiliados</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {yearlyStats.map((stat) => (
                      <TableRow key={stat.id}>
                        <TableCell className="font-medium">{stat.period_value}</TableCell>
                        <TableCell>{stat.total_orders}</TableCell>
                        <TableCell>{formatCurrency(stat.total_revenue)}</TableCell>
                        <TableCell>{stat.total_affiliates || 0}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <div className="text-center py-4 text-muted-foreground">
                  Nenhuma estatística anual disponível
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Estatísticas Mensais</CardTitle>
            <CardDescription>
              Resumo de vendas por mês
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {monthlyStats.length > 0 ? (
                <div className="max-h-96 overflow-y-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Período</TableHead>
                        <TableHead>Pedidos</TableHead>
                        <TableHead>Receita</TableHead>
                        <TableHead>Afiliados</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {monthlyStats.map((stat) => (
                        <TableRow key={stat.id}>
                          <TableCell className="font-medium">{stat.period_value}</TableCell>
                          <TableCell>{stat.total_orders}</TableCell>
                          <TableCell>{formatCurrency(stat.total_revenue)}</TableCell>
                          <TableCell>{stat.total_affiliates || 0}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              ) : (
                <div className="text-center py-4 text-muted-foreground">
                  Nenhuma estatística mensal disponível
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="mt-6">
        <Card>
          <CardHeader>
            <CardTitle>Detalhes de Distribuição</CardTitle>
            <CardDescription>
              Informações detalhadas sobre produtos, métodos de pagamento e afiliados
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Accordion type="single" collapsible className="w-full">
              {latestStats.year && (
                <AccordionItem value="products">
                  <AccordionTrigger>Distribuição de Produtos</AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-2">
                      {latestStats.year.product_distribution && (
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Produto</TableHead>
                              <TableHead>Quantidade</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {Object.entries(latestStats.year.product_distribution).map(([product, count]: [string, any]) => (
                              <TableRow key={product}>
                                <TableCell className="font-medium">{product}</TableCell>
                                <TableCell>{count}</TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      )}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              )}
              
              {latestStats.year && (
                <AccordionItem value="payments">
                  <AccordionTrigger>Métodos de Pagamento</AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-2">
                      {latestStats.year.payment_methods_distribution && (
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Método</TableHead>
                              <TableHead>Quantidade</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {Object.entries(latestStats.year.payment_methods_distribution).map(([method, count]: [string, any]) => (
                              <TableRow key={method}>
                                <TableCell className="font-medium">{method}</TableCell>
                                <TableCell>{count}</TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      )}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              )}
              
              {latestStats.year && (
                <AccordionItem value="affiliates">
                  <AccordionTrigger>Distribuição por Afiliados</AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-2">
                      {latestStats.year.affiliate_distribution && (
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Afiliado</TableHead>
                              <TableHead>Quantidade</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {Object.entries(latestStats.year.affiliate_distribution).map(([affiliate, count]: [string, any]) => (
                              <TableRow key={affiliate}>
                                <TableCell className="font-medium">{affiliate}</TableCell>
                                <TableCell>{count}</TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      )}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              )}
            </Accordion>
          </CardContent>
        </Card>
      </div>
    </>
  );
};
