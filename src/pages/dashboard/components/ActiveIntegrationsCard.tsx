
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useIntegrations } from '@/hooks/useIntegration';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const ActiveIntegrationsCard = () => {
  const { integrations, isLoading, refreshIntegrations } = useIntegrations();
  const [staticIntegrations, setStaticIntegrations] = useState([
    { name: 'Wbuy', status: 'Ativo', statusClass: 'text-green-600' },
    { name: 'Facebook', status: 'Ativo', statusClass: 'text-green-600' },
    { name: 'Active Campaign', status: 'Ativo', statusClass: 'text-green-600' },
    { name: 'Google Analytics', status: 'Pendente', statusClass: 'text-amber-600' },
    { name: 'Stape.io', status: 'Desconectado', statusClass: 'text-red-600' },
    { name: 'Tiny', status: 'Pendente', statusClass: 'text-amber-600' },
  ]);

  // Efeito para atualizar as integrações periodicamente
  useEffect(() => {
    // Carrega as integrações ao montar o componente
    refreshIntegrations();
    
    // Define um intervalo para atualizar as integrações a cada minuto
    const interval = setInterval(() => {
      refreshIntegrations();
    }, 60000); // 60000 ms = 1 minuto
    
    return () => clearInterval(interval);
  }, [refreshIntegrations]);

  // Formata o momento da última sincronização
  const formatLastSync = (lastSync) => {
    if (!lastSync) return '';
    
    try {
      const date = new Date(lastSync);
      return formatDistanceToNow(date, { addSuffix: true, locale: ptBR });
    } catch (error) {
      return '';
    }
  };

  // Mapeia os IDs das integrações para nomes mais amigáveis
  const integrationNames = {
    'wbuy': 'Wbuy',
    'facebook': 'Facebook',
    'activecampaign': 'Active Campaign',
    'google': 'Google Analytics',
    'stape': 'Stape.io',
    'tiny': 'Tiny',
    'airtable': 'Airtable',
  };

  // Atualiza os dados das integrações quando eles mudarem
  useEffect(() => {
    if (integrations && integrations.length > 0) {
      const updatedIntegrations = staticIntegrations.map(staticInteg => {
        // Encontra a integração correspondente no array de integrações reais
        const realInteg = integrations.find(
          i => integrationNames[i.id] === staticInteg.name
        );
        
        if (realInteg) {
          // Determina o status e a classe CSS com base no status real
          let status = 'Desconectado';
          let statusClass = 'text-red-600';
          
          if (realInteg.status === 'connected') {
            status = 'Ativo';
            statusClass = 'text-green-600';
            
            // Se houver informação de sincronização, atualiza o status
            if (realInteg.last_sync) {
              status = `Ativo (${formatLastSync(realInteg.last_sync)})`;
            }
            
            // Se houver erro na última sincronização, atualiza a classe
            if (realInteg.metadata?.last_sync_status === 'error') {
              statusClass = 'text-amber-600';
            }
          } else if (realInteg.status === 'pending') {
            status = 'Pendente';
            statusClass = 'text-amber-600';
          }
          
          return {
            ...staticInteg,
            status,
            statusClass,
          };
        }
        
        return staticInteg;
      });
      
      setStaticIntegrations(updatedIntegrations);
    }
  }, [integrations]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Integrações Ativas</CardTitle>
        <CardDescription>Status das conexões API</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {staticIntegrations.map((integration, index) => (
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
