
import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const ApiSettingsForm = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Configurações de API</CardTitle>
        <CardDescription>
          Configure suas integrações e chaves de API.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground mb-4">Esta seção está disponível apenas para administradores.</p>
        
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="aiderUrl">URL do Servidor AIDER</Label>
            <Input 
              id="aiderUrl" 
              placeholder="https://seu-servidor-aider.com" 
              defaultValue={localStorage.getItem('aiderServerUrl') || ''}
              onChange={(e) => localStorage.setItem('aiderServerUrl', e.target.value)}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="openaiApiKey">OpenAI API Key</Label>
            <Input 
              id="openaiApiKey" 
              type="password" 
              placeholder="sk-..." 
              defaultValue=""
            />
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button>Salvar Configurações de API</Button>
      </CardFooter>
    </Card>
  );
};

export default ApiSettingsForm;
