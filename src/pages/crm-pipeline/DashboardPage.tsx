
import React from 'react';
import { UsersIntegrationTest } from './components/UsersIntegrationTest';

const DashboardPage: React.FC = () => {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Dashboard CRM</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <UsersIntegrationTest />
        
        {/* Outros componentes do dashboard */}
        <div className="bg-muted/20 border p-6 rounded-lg text-center">
          <p className="text-xl font-medium mb-2">Status da Integração</p>
          <p className="text-muted-foreground">
            Verifique se os usuários da Wbuy estão sendo carregados corretamente
            para confirmar que a integração está funcionando.
          </p>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
