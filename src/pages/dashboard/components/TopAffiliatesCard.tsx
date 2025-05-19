
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const TopAffiliatesCard = () => {
  const affiliates = [
    { name: 'Carlos Silva', sales: 'R$ 12.580,00', conversion: '4.2%' },
    { name: 'Ana Ferreira', sales: 'R$ 9.845,00', conversion: '3.8%' },
    { name: 'Marcos Oliveira', sales: 'R$ 7.623,00', conversion: '3.5%' },
    { name: 'Juliana Costa', sales: 'R$ 6.421,00', conversion: '3.1%' },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Top Afiliados</CardTitle>
        <CardDescription>Por volume de vendas</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {affiliates.map((affiliate, index) => (
            <div key={index} className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-9 w-9 rounded-full bg-muted flex items-center justify-center">
                  <span className="text-xs font-medium">{affiliate.name.split(' ').map(n => n[0]).join('')}</span>
                </div>
                <div>
                  <p className="text-sm font-medium">{affiliate.name}</p>
                  <p className="text-xs text-muted-foreground">Conversão: {affiliate.conversion}</p>
                </div>
              </div>
              <span className="text-sm font-medium">{affiliate.sales}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default TopAffiliatesCard;
