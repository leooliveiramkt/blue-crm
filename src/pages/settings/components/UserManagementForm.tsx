
import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from '@/context/AuthContext';
import UserForm, { UserFormValues } from './user-management/UserForm';
import AccessLevelsInfo from './user-management/AccessLevelsInfo';
import { createUser } from '../services/userService';

const UserManagementForm = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const { hasPermission } = useAuth();
  
  const onSubmit = async (values: UserFormValues) => {
    console.log("Submetendo formulário", values);
    
    // Temporariamente removendo a verificação de permissão para debug
    // if (!hasPermission('admin')) {
    //   toast({
    //     title: "Acesso negado",
    //     description: "Você não tem permissão para criar usuários",
    //     variant: "destructive"
    //   });
    //   return;
    // }
    
    setIsSubmitting(true);
    
    try {
      const { data, error } = await createUser(values);
      
      if (error) {
        throw error;
      }
      
      const isSpecialAdmin = values.email.toLowerCase() === 'leooliveiramktd@gmail.com';
      
      if (isSpecialAdmin) {
        toast({
          title: "Administrador principal criado",
          description: "O usuário leooliveiramktd@gmail.com foi criado com sucesso como administrador principal.",
        });
      } else {
        toast({
          title: "Usuário criado",
          description: `${values.name} foi adicionado como ${values.role}`,
        });
      }
      
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
        <UserForm onSubmit={onSubmit} isSubmitting={isSubmitting} />
        <AccessLevelsInfo />
      </CardContent>
    </Card>
  );
};

export default UserManagementForm;
