
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Loader2, Check, AlertCircle } from 'lucide-react';
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
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  
  // Obter a configuração para acessar valores padrão
  const configData = config || getIntegrationConfig(integrationId);
  
  useEffect(() => {
    if (open) {
      // Resetar o estado quando o diálogo é aberto
      setSaveStatus('idle');
      setErrorMessage(null);
      
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
      setErrorMessage(`Campos obrigatórios: ${missingFields.join(', ')}`);
      toast({
        title: "Campos obrigatórios",
        description: `Por favor, preencha os seguintes campos: ${missingFields.join(', ')}`,
        variant: "destructive"
      });
      return;
    }

    // Limpa mensagem de erro
    setErrorMessage(null);
    setSaveStatus('saving');
    console.log(`[IntegrationConfigDialog] Iniciando conexão com ${integrationId}`, {
      camposPreenchidos: Object.keys(credentials),
      contemSenha: !!credentials.password,
      contemApiKey: !!credentials.apiKey,
      dominio: credentials.domain
    });
    
    try {
      console.log(`[IntegrationConfigDialog] Chamando connectIntegration() para ${integrationId}...`);
      
      // Se for Wbuy, garantir que apiKey comece com "Bearer "
      if (integrationId === 'wbuy' && credentials.apiKey && !credentials.apiKey.startsWith('Bearer ')) {
        credentials.apiKey = `Bearer ${credentials.apiKey}`;
        console.log('[IntegrationConfigDialog] Ajustando token para iniciar com Bearer');
      }
      
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
        setErrorMessage('Falha na conexão. Verifique as credenciais e tente novamente.');
        toast({
          title: "Erro na conexão",
          description: `Não foi possível estabelecer conexão com ${configData.name}. Verifique as credenciais.`,
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error(`[IntegrationConfigDialog] Erro durante a conexão:`, error);
      setSaveStatus('error');
      setErrorMessage(error instanceof Error ? error.message : 'Erro desconhecido');
      toast({
        title: "Erro inesperado",
        description: `Ocorreu um erro ao tentar conectar com ${configData.name}: ${error instanceof Error ? error.message : 'Erro desconhecido'}`,
        variant: "destructive"
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>Configurar integração: {configData.name}</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4 max-h-[60vh] overflow-y-auto">
          {errorMessage && (
            <div className="bg-destructive/10 p-3 rounded-md border border-destructive flex items-start gap-2">
              <AlertCircle className="h-5 w-5 text-destructive shrink-0 mt-0.5" />
              <p className="text-sm text-destructive">{errorMessage}</p>
            </div>
          )}
          
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
                className={field.name === 'apiKey' ? 'font-mono text-sm' : ''}
              />
              {field.name === 'apiKey' && (
                <p className="text-xs text-muted-foreground mt-1">
                  Importante: O token deve começar com "Bearer " seguido pelo valor do token.
                  {!credentials.apiKey?.startsWith('Bearer ') && credentials.apiKey && (
                    <span className="text-yellow-600"> Será adicionado automaticamente.</span>
                  )}
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
              setErrorMessage(null);
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
            ) : saveStatus === 'error' ? (
              'Tentar Novamente'
            ) : 'Salvar e Conectar'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
