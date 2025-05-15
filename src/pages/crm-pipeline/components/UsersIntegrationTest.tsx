
import React, { useEffect } from 'react';
import { useUsers } from '../hooks/users';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { RefreshCcw, User, AlertCircle } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

export const UsersIntegrationTest: React.FC = () => {
  const { users, isLoading, error, fetchUsers } = useUsers();
  
  useEffect(() => {
    // Buscar usuários ao montar o componente
    fetchUsers();
  }, []);
  
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Teste de Integração Wbuy - Usuários</span>
          <Badge variant={users.length > 0 ? "default" : "destructive"} className={users.length > 0 ? "bg-green-500" : ""}>
            {users.length > 0 ? "Integração Ativa" : "Verificando"}
          </Badge>
        </CardTitle>
        <CardDescription>
          Este componente verifica se a API da Wbuy está corretamente integrada ao CRM
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        {isLoading ? (
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">Carregando usuários...</p>
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center space-x-4">
                <Skeleton className="h-12 w-12 rounded-full" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-[250px]" />
                  <Skeleton className="h-4 w-[200px]" />
                </div>
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="flex items-center space-x-2 p-4 border rounded-md border-destructive/50 bg-destructive/10">
            <AlertCircle className="h-5 w-5 text-destructive" />
            <div>
              <p className="font-medium">Erro na integração</p>
              <p className="text-sm text-muted-foreground">{error}</p>
            </div>
          </div>
        ) : users.length === 0 ? (
          <p className="text-center py-8 text-muted-foreground">
            Nenhum usuário encontrado. A API pode estar indisponível ou não há dados para exibir.
          </p>
        ) : (
          <div className="space-y-4">
            <p className="text-sm font-medium">Usuários encontrados: {users.length}</p>
            <div className="divide-y">
              {users.map(user => (
                <div key={user.id} className="py-3 flex items-start space-x-4">
                  <div className="bg-primary/10 p-2 rounded-full">
                    <User className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">{user.name}</p>
                    {user.email && (
                      <p className="text-sm text-muted-foreground">{user.email}</p>
                    )}
                    {user.role && (
                      <Badge variant="outline" className="mt-1">
                        {user.role}
                      </Badge>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
      
      <CardFooter>
        <Button 
          variant="outline" 
          onClick={() => fetchUsers()} 
          disabled={isLoading}
          className="w-full"
        >
          <RefreshCcw className="mr-2 h-4 w-4" />
          {isLoading ? 'Carregando...' : 'Atualizar Dados'}
        </Button>
      </CardFooter>
    </Card>
  );
};
