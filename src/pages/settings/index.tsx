
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from '@/context/AuthContext';
import { ThemeConfig, updateThemeConfig } from "@/config/theme";
import { useToast } from "@/components/ui/use-toast";
import BrandingForm from './components/BrandingForm';
import ApiSettingsForm from './components/ApiSettingsForm';
import UserManagementForm from './components/UserManagementForm';

const Settings = () => {
  const { hasPermission } = useAuth();
  const { toast } = useToast();
  const [isSaving, setIsSaving] = useState(false);

  const handleSaveConfig = async (newConfig: typeof ThemeConfig) => {
    setIsSaving(true);
    
    try {
      const success = await updateThemeConfig(newConfig);
      
      if (success) {
        toast({
          title: "Configurações salvas",
          description: "As alterações foram aplicadas e salvas no Supabase com sucesso.",
        });
      } else {
        toast({
          title: "Erro ao salvar",
          description: "Houve um problema ao salvar as configurações no Supabase.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Erro ao salvar configurações:', error);
      toast({
        title: "Erro ao salvar",
        description: "Houve um problema ao processar sua solicitação.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  if (!hasPermission('admin')) {
    return (
      <div className="container mx-auto py-10">
        <Card>
          <CardHeader>
            <CardTitle>Acesso Restrito</CardTitle>
            <CardDescription>
              Você não tem permissão para acessar esta página.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p>As configurações do sistema só podem ser alteradas por usuários com nível de acesso de administrador.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">Configurações do Sistema</h1>
      
      <Tabs defaultValue="branding">
        <TabsList className="mb-6">
          <TabsTrigger value="branding">Marca e Aparência</TabsTrigger>
          <TabsTrigger value="api">APIs e Integrações</TabsTrigger>
          <TabsTrigger value="users">Usuários e Permissões</TabsTrigger>
        </TabsList>
        
        <TabsContent value="branding">
          <BrandingForm 
            config={ThemeConfig} 
            onSubmit={handleSaveConfig}
            isSaving={isSaving}
          />
        </TabsContent>
        
        <TabsContent value="api">
          <ApiSettingsForm />
        </TabsContent>
        
        <TabsContent value="users">
          <UserManagementForm />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Settings;
