
import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const UserManagementForm = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Gerenciamento de Usuários</CardTitle>
        <CardDescription>
          Adicione e configure usuários e suas permissões.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground mb-6">Em desenvolvimento.</p>
        
        <div className="border rounded-md p-4">
          <h3 className="font-medium mb-2">Níveis de Acesso</h3>
          <ul className="space-y-2 text-sm">
            <li><strong>Admin:</strong> Acesso completo a todas as funcionalidades e configurações</li>
            <li><strong>Diretor:</strong> Acesso a análises e relatórios, sem configurações de sistema</li>
            <li><strong>Consulta:</strong> Acesso apenas para visualização de dados básicos</li>
          </ul>
        </div>
      </CardContent>
      <CardFooter>
        <Button disabled>Criar Novo Usuário</Button>
      </CardFooter>
    </Card>
  );
};

export default UserManagementForm;
