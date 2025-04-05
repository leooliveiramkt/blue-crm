
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ShieldAlertIcon } from 'lucide-react';

const Unauthorized = () => {
  const navigate = useNavigate();

  return (
    <div className="flex items-center justify-center min-h-screen bg-background p-4">
      <div className="text-center max-w-md">
        <ShieldAlertIcon className="h-20 w-20 text-destructive mx-auto mb-6" />
        <h1 className="text-3xl font-bold mb-4">Acesso Não Autorizado</h1>
        <p className="text-muted-foreground mb-8">
          Você não possui permissão para acessar este recurso. Entre em contato com um administrador se acredita que isto é um erro.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button 
            variant="outline" 
            onClick={() => navigate(-1)}
          >
            Voltar
          </Button>
          <Button 
            onClick={() => navigate('/dashboard')}
          >
            Ir para Dashboard
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Unauthorized;
