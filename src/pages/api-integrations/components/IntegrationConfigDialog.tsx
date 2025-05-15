
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Loader2 } from 'lucide-react';
import { getIntegrationConfig } from '@/lib/integrations/integrationConfigs';
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
  const { isConnecting, connectIntegration, integration, config } = useIntegration(integrationId);
  const [credentials, setCredentials] = useState<Record<string, string>>(
    integration?.credentials || {}
  );

  const configData = config || getIntegrationConfig(integrationId);
  
  if (!configData) {
    return null;
  }

  const handleInputChange = (fieldName: string, value: string) => {
    setCredentials(prev => ({ ...prev, [fieldName]: value }));
  };

  const handleSubmit = async () => {
    // Verificar se todos os campos obrigatórios foram preenchidos
    const missingFields = configData.requiredFields
      .filter(field => field.required && !credentials[field.name])
      .map(field => field.label);

    if (missingFields.length > 0) {
      toast({
        title: "Campos obrigatórios",
        description: `Por favor, preencha os seguintes campos: ${missingFields.join(', ')}`,
        variant: "destructive"
      });
      return;
    }

    const success = await connectIntegration(credentials);
    
    if (success) {
      toast({
        title: "Integração conectada",
        description: `A integração com ${configData.name} foi configurada com sucesso.`
      });
      if (onSuccess) onSuccess();
      onOpenChange(false);
    } else {
      toast({
        title: "Erro na conexão",
        description: `Não foi possível estabelecer conexão com ${configData.name}. Verifique as credenciais.`,
        variant: "destructive"
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Configurar integração: {configData.name}</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
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
            </div>
          ))}
        </div>
        <DialogFooter>
          <Button 
            variant="outline" 
            onClick={() => onOpenChange(false)} 
            disabled={isConnecting}
          >
            Cancelar
          </Button>
          <Button 
            onClick={handleSubmit} 
            disabled={isConnecting}
          >
            {isConnecting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Conectando...
              </>
            ) : 'Salvar e Conectar'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
