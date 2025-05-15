
import React from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { IntegrationCardProps } from '../types';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { IntegrationType } from '@/lib/integrations/types';

// Formata o momento da última sincronização
const formatLastSync = (lastSync?: string) => {
  if (!lastSync) return 'Nunca sincronizado';
  
  try {
    const date = new Date(lastSync);
    return formatDistanceToNow(date, { addSuffix: true, locale: ptBR });
  } catch (error) {
    return 'Data inválida';
  }
};

// Retorna a classe CSS baseada no status de sincronização
const getSyncStatusClass = (syncStatus?: string) => {
  if (!syncStatus) return 'text-amber-600';
  return syncStatus === 'success' ? 'text-green-600' : 'text-red-600';
};

export const IntegrationCard: React.FC<IntegrationCardProps> = ({
  id,
  name,
  description,
  color,
  connected,
  lastSync,
  syncStatus,
  onConnect
}) => {
  // Obtenha o componente de ícone apropriado usando o utilitário
  const IconComponent = useIntegrationIcon(id);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div className="flex items-center space-x-3">
          <div className={`p-2.5 rounded-full ${color}`}>
            {IconComponent && <IconComponent size={16} />}
          </div>
          <CardTitle className="text-md font-medium">
            {name}
          </CardTitle>
        </div>
        <div className="flex items-center space-x-2">
          <Switch
            id={`${id}-switch`}
            checked={connected}
          />
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-xs text-muted-foreground">{description}</p>
        <div className="mt-3 space-y-1">
          <p className="text-xs font-medium text-muted-foreground">
            Status: 
            <span className={connected ? "text-green-600 ml-1" : "text-amber-600 ml-1"}>
              {connected ? "Conectado" : "Não conectado"}
            </span>
          </p>
          <p className="text-xs font-medium text-muted-foreground">
            Última atualização: 
            <span className={`ml-1 ${getSyncStatusClass(syncStatus)}`}>
              {formatLastSync(lastSync)}
            </span>
          </p>
        </div>
      </CardContent>
      <CardFooter>
        {connected ? (
          <Button variant="outline" className="w-full">Configurar</Button>
        ) : (
          <Button className="w-full" onClick={() => onConnect(id)}>Conectar</Button>
        )}
      </CardFooter>
    </Card>
  );
};

// Utilitário para obter o ícone correto baseado no ID da integração
function useIntegrationIcon(integrationId: IntegrationType) {
  const { ShoppingCart } = useIntegrationIcons();
  
  const iconMap = {
    'wbuy': ShoppingCart,
    'facebook': () => React.createElement('svg', { 
      xmlns: "http://www.w3.org/2000/svg",
      width: "24",
      height: "24",
      viewBox: "0 0 24 24",
      fill: "none",
      stroke: "currentColor",
      strokeWidth: "2",
      strokeLinecap: "round",
      strokeLinejoin: "round"
    }, React.createElement('path', { d: "M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" })),
    'activecampaign': () => React.createElement('svg', {
      xmlns: "http://www.w3.org/2000/svg",
      width: "24",
      height: "24",
      viewBox: "0 0 24 24",
      fill: "none",
      stroke: "currentColor",
      strokeWidth: "2",
      strokeLinecap: "round",
      strokeLinejoin: "round"
    }, React.createElement('path', { d: "M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" }),
       React.createElement('path', { d: "m22 6-10 7L2 6" })),
    'google': () => React.createElement('svg', {
      xmlns: "http://www.w3.org/2000/svg",
      width: "24",
      height: "24",
      viewBox: "0 0 24 24",
      fill: "none",
      stroke: "currentColor",
      strokeWidth: "2",
      strokeLinecap: "round",
      strokeLinejoin: "round"
    }, React.createElement('path', { d: "M22 12.5V6c0-1.1-.9-2-2-2H4a2 2 0 0 0-2 2v12c0 1.1.9 2 2 2h9.5" }),
       React.createElement('path', { d: "m22 8-5 4-5-4" }),
       React.createElement('path', { d: "M18 21a3 3 0 1 0 0-6 3 3 0 0 0 0 6z" }),
       React.createElement('path', { d: "m18 16 3 3" })),
    'stape': () => React.createElement('svg', {
      xmlns: "http://www.w3.org/2000/svg",
      width: "24",
      height: "24",
      viewBox: "0 0 24 24",
      fill: "none",
      stroke: "currentColor",
      strokeWidth: "2",
      strokeLinecap: "round",
      strokeLinejoin: "round"
    }, React.createElement('circle', { cx: "12", cy: "12", r: "10" }),
       React.createElement('path', { d: "M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" }),
       React.createElement('path', { d: "M2 12h20" })),
    'tiny': () => React.createElement('svg', {
      xmlns: "http://www.w3.org/2000/svg",
      width: "24",
      height: "24",
      viewBox: "0 0 24 24",
      fill: "none",
      stroke: "currentColor",
      strokeWidth: "2",
      strokeLinecap: "round",
      strokeLinejoin: "round"
    }, React.createElement('rect', { width: "20", height: "14", x: "2", y: "7", rx: "2", ry: "2" }),
       React.createElement('path', { d: "M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" })),
    'airtable': () => React.createElement('svg', {
      xmlns: "http://www.w3.org/2000/svg",
      width: "24",
      height: "24",
      viewBox: "0 0 24 24",
      fill: "none",
      stroke: "currentColor",
      strokeWidth: "2",
      strokeLinecap: "round",
      strokeLinejoin: "round"
    }, React.createElement('path', { d: "M4 7v10c0 1.1.9 2 2 2h12a2 2 0 0 0 2-2V7c0-1.1-.9-2-2-2H6a2 2 0 0 0-2 2z" }),
       React.createElement('path', { d: "M4 7v10c0 1.1.9 2 2 2h12a2 2 0 0 0 2-2V7" }),
       React.createElement('path', { d: "M4 7v10c0 1.1.9 2 2 2h12a2 2 0 0 0 2-2V7" }),
       React.createElement('path', { d: "M5 7V4c0-.6.4-1 1-1h12c.6 0 1 .4 1 1v3" })),
  };

  return iconMap[integrationId];
}

// Hook para criar e retornar ícones personalizados
function useIntegrationIcons() {
  const ShoppingCart = (props: { size?: number }) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={props.size || 24}
      height={props.size || 24}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="8" cy="21" r="1" />
      <circle cx="19" cy="21" r="1" />
      <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12" />
    </svg>
  );

  return { ShoppingCart };
}
