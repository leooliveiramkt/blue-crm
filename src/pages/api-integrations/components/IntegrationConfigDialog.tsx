
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Loader2, Check } from 'lucide-react';
import { getIntegrationConfig } from '@/lib/integrations/configs';
import { useIntegration } from '@/hooks/useIntegration';
import { IntegrationType } from '@/lib/integrations/types';
import { useToast } from '@/hooks/use-toast';

interface IntegrationConfigDialogProps {
  integrationId: IntegrationType;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export const IntegrationConfigDialog: React.FC<IntegrationConfigDialogProps> = ({
  integrationId,
  open,
  onOpenChange,
  onSuccess
}) => {
  const { toast } = useToast();
  const { isConnecting, connectIntegration, integration, config, isConnected } = useIntegration(integrationId);
  const [credentials, setCredentials] = useState<Record<string, string>>({});
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'success' | 'error'>('idle');
  
  // Obter a configuração para acessar valores padrão
  const configData = config || getIntegrationConfig(integrationId);
  
  useEffect(() => {
    if (open) {
      // Se integração já existe, usar suas credenciais
      if (integration?.credentials) {
        console.log(`[IntegrationConfigDialog] Carregando credenciais existentes para ${integrationId}:`, 
          Object.keys(integration.credentials).length > 0 ? 'Credenciais encontradas' : 'Sem credenciais');
        setCredentials(integration.credentials);
      } else {
        // Inicializar com valores padrão se disponíveis
        const defaultValues: Record<string, string> = {};
        configData?.requiredFields.forEach(field => {
          if (field.defaultValue) {
            defaultValues[field.name] = field.defaultValue;
          }
        });
        setCredentials(defaultValues);
      }
    }
  }, [integration, integrationId, open, configData]);

  if (!configData) {
    console.error(`[IntegrationConfigDialog] Configuração não encontrada para ${integrationId}`);
    return null;
  }

  const handleInputChange = (fieldName: string, value: string) => {
    console.log(`[IntegrationConfigDialog] Campo alterado: ${fieldName}`);
    setCredentials(prev => ({ ...prev, [fieldName]: value }));
  };

  const handleSubmit = async () => {
    // Verificar se todos os campos obrigatórios foram preenchidos
    const missingFields = configData.requiredFields
      .filter(field => field.required && !credentials[field.name])
      .map(field => field.label);

    if (missingFields.length > 0) {
      console.error(`[IntegrationConfigDialog] Campos obrigatórios não preenchidos: ${missingFields.join(', ')}`);
      toast({
        title: "Campos obrigatórios",
        description: `Por favor, preencha os seguintes campos: ${missingFields.join(', ')}`,
        variant: "destructive"
      });
      return;
    }

    setSaveStatus('saving');
    console.log(`[IntegrationConfigDialog] Iniciando conexão com ${integrationId}`, {
      camposPreenchidos: Object.keys(credentials),
      contemSenha: !!credentials.password,
      contemApiKey: !!credentials.apiKey,
      dominio: credentials.domain
    });
    
    try {
      console.log(`[IntegrationConfigDialog] Chamando connectIntegration() para ${integrationId}...`);
      const success = await connectIntegration(credentials);
      console.log(`[IntegrationConfigDialog] Resposta da tentativa de conexão: ${success ? 'Sucesso' : 'Falha'}`);
      
      if (success) {
        setSaveStatus('success');
        toast({
          title: "Integração conectada",
          description: `A integração com ${configData.name} foi configurada com sucesso.`
        });
        
        // Deixar a mensagem de sucesso visível por um momento antes de fechar
        setTimeout(() => {
          if (onSuccess) onSuccess();
          onOpenChange(false);
          setSaveStatus('idle');
        }, 1500);
      } else {
        setSaveStatus('error');
        toast({
          title: "Erro na conexão",
          description: `Não foi possível estabelecer conexão com ${configData.name}. Verifique as credenciais.`,
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error(`[IntegrationConfigDialog] Erro durante a conexão:`, error);
      setSaveStatus('error');
      toast({
        title: "Erro inesperado",
        description: `Ocorreu um erro ao tentar conectar com ${configData.name}: ${error instanceof Error ? error.message : 'Erro desconhecido'}`,
        variant: "destructive"
      });
    } finally {
      setSaveStatus('idle');
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>Configurar integração: {configData.name}</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4 max-h-[60vh] overflow-y-auto">
          {configData.requiredFields.map((field) => (
            <div key={field.name} className="space-y-2">
              <Label htmlFor={field.name}>
                {field.label} {field.required && <span className="text-red-500">*</span>}
              </Label>
              <Input
                id={field.name}
                type={field.type}
                placeholder={field.placeholder}
                value={credentials[field.name] || ''}
                onChange={(e) => handleInputChange(field.name, e.target.value)}
                required={field.required}
              />
              {field.name === 'apiKey' && (
                <p className="text-xs text-muted-foreground mt-1">
                  Importante: O token deve começar com "Bearer " seguido pelo valor do token.
                </p>
              )}
              {field.name === 'domain' && (
                <p className="text-xs text-muted-foreground mt-1">
                  URL padrão da API Wbuy: https://sistema.sistemawbuy.com.br/api/v1
                </p>
              )}
            </div>
          ))}
        </div>
        <DialogFooter>
          <Button 
            variant="outline" 
            onClick={() => {
              setSaveStatus('idle');
              onOpenChange(false);
            }} 
            disabled={isConnecting || saveStatus === 'saving' || saveStatus === 'success'}
          >
            Cancelar
          </Button>
          <Button 
            onClick={handleSubmit} 
            disabled={isConnecting || saveStatus === 'saving' || saveStatus === 'success'}
            className="min-w-[140px]"
          >
            {saveStatus === 'saving' || isConnecting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Conectando...
              </>
            ) : saveStatus === 'success' ? (
              <>
                <Check className="mr-2 h-4 w-4" />
                Conectado!
              </>
            ) : 'Salvar e Conectar'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
