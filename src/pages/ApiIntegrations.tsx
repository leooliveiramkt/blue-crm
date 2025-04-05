
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Database, Facebook, Globe, Mail, BarChart3, Archive } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

// Define the ShoppingCart component at the top before it's used
const ShoppingCart = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
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

const integrations = [
  {
    id: 'wbuy',
    name: 'Wbuy',
    description: 'Sistema de vendas e gestão de afiliados',
    icon: ShoppingCart,
    color: 'bg-blue-100 text-blue-700',
    connected: true,
  },
  {
    id: 'facebook',
    name: 'Facebook',
    description: 'Integração com API de anúncios do Facebook',
    icon: Facebook,
    color: 'bg-blue-100 text-blue-700',
    connected: true,
  },
  {
    id: 'activecampaign',
    name: 'Active Campaign',
    description: 'Automação de marketing e gestão de leads',
    icon: Mail,
    color: 'bg-green-100 text-green-700',
    connected: true,
  },
  {
    id: 'google',
    name: 'Google Analytics',
    description: 'Análise de tráfego e conversões',
    icon: BarChart3,
    color: 'bg-yellow-100 text-yellow-700',
    connected: false,
  },
  {
    id: 'stape',
    name: 'Stape.io',
    description: 'Servidor de tags e rastreamento',
    icon: Globe,
    color: 'bg-purple-100 text-purple-700',
    connected: false,
  },
  {
    id: 'tiny',
    name: 'Tiny',
    description: 'Sistema de gestão empresarial',
    icon: Archive,
    color: 'bg-pink-100 text-pink-700',
    connected: false,
  },
  {
    id: 'airtable',
    name: 'Airtable',
    description: 'Base de dados colaborativa',
    icon: Database,
    color: 'bg-green-100 text-green-700',
    connected: false,
  },
];

const ApiIntegrations = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('overview');
  const [apiKeys, setApiKeys] = useState({
    wbuy: '••••••••••••••••',
    facebook: '••••••••••••••••',
    activecampaign: '••••••••••••••••',
    google: '',
    stape: '',
    tiny: '',
    airtable: '',
  });

  const handleConnect = (integrationId) => {
    toast({
      title: 'Solicitação de conexão',
      description: `Iniciando processo de conexão com ${integrationId.charAt(0).toUpperCase() + integrationId.slice(1)}...`,
    });
  };

  const handleSaveApiKey = (integrationId, apiKey) => {
    setApiKeys({
      ...apiKeys,
      [integrationId]: apiKey,
    });
    
    toast({
      title: 'Chave API Salva',
      description: `A chave API para ${integrationId.charAt(0).toUpperCase() + integrationId.slice(1)} foi salva com sucesso.`,
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Integrações API</h2>
        <p className="text-muted-foreground">Gerencie todas as suas conexões API e integrações.</p>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Visão Geral</TabsTrigger>
          <TabsTrigger value="settings">Configurações</TabsTrigger>
          <TabsTrigger value="webhooks">Webhooks</TabsTrigger>
          <TabsTrigger value="logs">Logs</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {integrations.map((integration) => (
              <Card key={integration.id}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <div className="flex items-center space-x-3">
                    <div className={`p-2.5 rounded-full ${integration.color}`}>
                      <integration.icon className="h-4 w-4" />
                    </div>
                    <CardTitle className="text-md font-medium">
                      {integration.name}
                    </CardTitle>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      id={`${integration.id}-switch`}
                      checked={integration.connected}
                    />
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-xs text-muted-foreground">{integration.description}</p>
                  <div className="mt-3">
                    <p className="text-xs font-medium text-muted-foreground">
                      Status: 
                      <span className={integration.connected ? "text-green-600 ml-1" : "text-amber-600 ml-1"}>
                        {integration.connected ? "Conectado" : "Não conectado"}
                      </span>
                    </p>
                  </div>
                </CardContent>
                <CardFooter>
                  {integration.connected ? (
                    <Button variant="outline" className="w-full">Configurar</Button>
                  ) : (
                    <Button className="w-full" onClick={() => handleConnect(integration.id)}>Conectar</Button>
                  )}
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="settings" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Configurações de API</CardTitle>
              <CardDescription>Gerencie suas chaves e tokens de API para cada integração.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {integrations.map((integration) => (
                <div key={integration.id} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor={`${integration.id}-api-key`} className="flex items-center gap-2">
                      <integration.icon className="h-4 w-4" />
                      {integration.name}
                    </Label>
                    <span className={`text-xs font-medium ${integration.connected ? "text-green-600" : "text-amber-600"}`}>
                      {integration.connected ? "Ativo" : "Inativo"}
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <Input
                      id={`${integration.id}-api-key`}
                      type="text"
                      placeholder={integration.connected ? "••••••••••••••••" : "Insira sua chave API"}
                      defaultValue={apiKeys[integration.id]}
                    />
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => {
                        const input = document.getElementById(`${integration.id}-api-key`) as HTMLInputElement;
                        handleSaveApiKey(integration.id, input.value);
                      }}
                    >
                      Salvar
                    </Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="webhooks" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Webhooks</CardTitle>
              <CardDescription>Configure endpoints para receber notificações em tempo real.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="webhook-url">URL de Callback</Label>
                <Input
                  id="webhook-url"
                  type="text"
                  placeholder="https://seuservidor.com/webhook/callback"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Eventos</Label>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Switch id="event-order" />
                      <Label htmlFor="event-order">Novo Pedido</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch id="event-customer" />
                      <Label htmlFor="event-customer">Novo Cliente</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch id="event-affiliate" />
                      <Label htmlFor="event-affiliate">Novo Afiliado</Label>
                    </div>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Formato</Label>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Switch id="format-json" defaultChecked />
                      <Label htmlFor="format-json">JSON</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch id="format-xml" />
                      <Label htmlFor="format-xml">XML</Label>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline">Testar Webhook</Button>
              <Button>Salvar Configuração</Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="logs" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Logs de API</CardTitle>
              <CardDescription>Visualize as últimas chamadas e respostas de API.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { time: '15:42:30', service: 'Wbuy', endpoint: '/orders', status: '200' },
                  { time: '15:38:12', service: 'Facebook', endpoint: '/insights', status: '200' },
                  { time: '15:35:01', service: 'Active Campaign', endpoint: '/contacts', status: '201' },
                  { time: '15:30:45', service: 'Wbuy', endpoint: '/affiliates/stats', status: '200' },
                  { time: '15:28:17', service: 'Wbuy', endpoint: '/order/update', status: '403' },
                  { time: '15:25:09', service: 'Active Campaign', endpoint: '/lists', status: '200' },
                ].map((log, index) => (
                  <div key={index} className="flex justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <span className="text-muted-foreground">{log.time}</span>
                      <span className="font-medium">{log.service}</span>
                      <span className="text-muted-foreground">{log.endpoint}</span>
                    </div>
                    <span className={log.status.startsWith('2') ? 'text-green-600' : 'text-red-600'}>
                      {log.status}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full">Ver Todos os Logs</Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ApiIntegrations;
