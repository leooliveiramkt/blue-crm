
import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from '@/context/AuthContext';
import { UserRole } from '@/types/auth';
import { Loader2 } from "lucide-react";
import { supabase } from '@/lib/supabase';

const UserManagementForm = () => {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<UserRole>('consultant');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const { hasPermission } = useAuth();

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!hasPermission('admin')) {
      toast({
        title: "Acesso negado",
        description: "Você não tem permissão para criar usuários",
        variant: "destructive"
      });
      return;
    }
    
    if (!email || !password || !role || !name) {
      toast({
        title: "Campos incompletos",
        description: "Todos os campos são obrigatórios",
        variant: "destructive"
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Verificar se é o usuário específico solicitado
      const isSpecialAdmin = email.toLowerCase() === 'leooliveiramktd@gmail.com';
      
      // Para o usuário específico, garantir que seja criado como admin
      const userRole = isSpecialAdmin ? 'admin' : role;
      
      // Criar usuário no Supabase Auth
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            first_name: name.split(' ')[0],
            last_name: name.split(' ').slice(1).join(' '),
            role: userRole
          }
        }
      });
      
      if (error) {
        throw error;
      }
      
      if (isSpecialAdmin) {
        toast({
          title: "Administrador principal criado",
          description: "O usuário leooliveiramktd@gmail.com foi criado com sucesso como administrador principal.",
          variant: "success"
        });
      } else {
        toast({
          title: "Usuário criado",
          description: `${name} foi adicionado como ${role}`,
          variant: "success"
        });
      }
      
      // Limpar formulário
      setEmail('');
      setName('');
      setPassword('');
      setRole('consultant');
      
    } catch (error: any) {
      console.error('Erro ao criar usuário:', error);
      
      let mensagemErro = "Erro ao criar usuário. Tente novamente.";
      if (error.message) {
        if (error.message.includes("already registered")) {
          mensagemErro = "Este email já está registrado.";
        }
      }
      
      toast({
        title: "Erro",
        description: mensagemErro,
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Gerenciamento de Usuários</CardTitle>
        <CardDescription>
          Adicione e configure usuários e suas permissões.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleCreateUser} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input 
              id="email" 
              type="email" 
              placeholder="email@exemplo.com" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="name">Nome completo</Label>
            <Input 
              id="name" 
              placeholder="Nome do usuário" 
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="password">Senha</Label>
            <Input 
              id="password" 
              type="password" 
              placeholder="Senha forte para o usuário" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="role">Nível de Acesso</Label>
            <Select 
              value={role} 
              onValueChange={(value: UserRole) => setRole(value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione o nível de acesso" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="admin">Administrador</SelectItem>
                <SelectItem value="director">Diretor</SelectItem>
                <SelectItem value="consultant">Consultor</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Criando...
              </>
            ) : (
              'Criar Novo Usuário'
            )}
          </Button>
        </form>
        
        <div className="border rounded-md p-4 mt-6">
          <h3 className="font-medium mb-2">Níveis de Acesso</h3>
          <ul className="space-y-2 text-sm">
            <li><strong>Admin:</strong> Acesso completo a todas as funcionalidades e configurações</li>
            <li><strong>Diretor:</strong> Acesso a análises e relatórios, sem configurações de sistema</li>
            <li><strong>Consulta:</strong> Acesso apenas para visualização de dados básicos</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};

export default UserManagementForm;
