
import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';

export const WebhooksForm: React.FC = () => {
  return (
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
  );
};
