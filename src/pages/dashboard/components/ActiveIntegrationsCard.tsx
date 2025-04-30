
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const ActiveIntegrationsCard = () => {
  const integrations = [
    { name: 'Wbuy', status: 'Ativo', statusClass: 'text-green-600' },
    { name: 'Facebook', status: 'Ativo', statusClass: 'text-green-600' },
    { name: 'Active Campaign', status: 'Ativo', statusClass: 'text-green-600' },
    { name: 'Google Analytics', status: 'Pendente', statusClass: 'text-amber-600' },
    { name: 'Stape.io', status: 'Desconectado', statusClass: 'text-red-600' },
    { name: 'Tiny', status: 'Pendente', statusClass: 'text-amber-600' },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Integrações Ativas</CardTitle>
        <CardDescription>Status das conexões API</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {integrations.map((integration, index) => (
            <div key={index} className="flex items-center justify-between">
              <p className="text-sm font-medium">{integration.name}</p>
              <span className={`text-sm font-medium ${integration.statusClass}`}>{integration.status}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default ActiveIntegrationsCard;
