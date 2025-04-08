
import React, { useState, useRef } from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ThemeConfig, updateThemeConfig } from "@/config/theme";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from '@/context/AuthContext';
import { Upload, ImageIcon } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";

const Settings = () => {
  const { hasPermission } = useAuth();
  const { toast } = useToast();
  const [config, setConfig] = useState({...ThemeConfig});
  const logoInputRef = useRef<HTMLInputElement>(null);
  const bgInputRef = useRef<HTMLInputElement>(null);
  const [logoPreview, setLogoPreview] = useState<string | undefined>(config.logo);
  const [bgPreview, setBgPreview] = useState<string | undefined>(config.loginBackground);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setConfig({
      ...config,
      [name]: value
    });
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, type: 'logo' | 'background') => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Verificar o tamanho do arquivo (limite de 2MB)
    if (file.size > 2 * 1024 * 1024) {
      toast({
        title: "Erro de upload",
        description: "O arquivo é muito grande. O tamanho máximo é de 2MB.",
        variant: "destructive",
      });
      return;
    }

    // Verificar o tipo do arquivo
    if (!file.type.match('image.*')) {
      toast({
        title: "Erro de upload",
        description: "Por favor, selecione um arquivo de imagem válido.",
        variant: "destructive",
      });
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        const imageDataUrl = event.target.result as string;
        
        if (type === 'logo') {
          setLogoPreview(imageDataUrl);
          setConfig({
            ...config,
            logo: imageDataUrl
          });
        } else {
          setBgPreview(imageDataUrl);
          setConfig({
            ...config,
            loginBackground: imageDataUrl
          });
        }
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateThemeConfig(config);
    toast({
      title: "Configurações salvas",
      description: "As alterações foram aplicadas com sucesso.",
    });
    // In a real app, this would send the config to a backend API
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
          <form onSubmit={handleSubmit}>
            <Card>
              <CardHeader>
                <CardTitle>Personalização da Marca</CardTitle>
                <CardDescription>
                  Configure a identidade visual do sistema para sua empresa ou cliente.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="companyName">Nome da Empresa</Label>
                    <Input 
                      id="companyName" 
                      name="companyName" 
                      value={config.companyName} 
                      onChange={handleChange} 
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="logo">Logo da Empresa</Label>
                    <div className="flex flex-col gap-3">
                      <div className="flex items-center gap-2">
                        <input
                          type="file"
                          ref={logoInputRef}
                          onChange={(e) => handleImageUpload(e, 'logo')}
                          className="hidden"
                          accept="image/*"
                        />
                        <Button 
                          type="button" 
                          variant="outline"
                          onClick={() => logoInputRef.current?.click()}
                          className="flex items-center gap-2"
                        >
                          <Upload size={16} /> Fazer upload
                        </Button>
                        <span className="text-sm text-muted-foreground">ou</span>
                        <Input 
                          id="logo" 
                          name="logo" 
                          value={typeof config.logo === 'string' && !config.logo.startsWith('data:') ? config.logo : ''} 
                          onChange={handleChange} 
                          placeholder="https://example.com/logo.png"
                          className="flex-1"
                        />
                      </div>
                      
                      {logoPreview && (
                        <div className="relative border rounded-md p-3 mt-2 bg-muted/20">
                          <p className="text-xs mb-2 text-muted-foreground">Pré-visualização:</p>
                          <img 
                            src={logoPreview} 
                            alt="Logo preview" 
                            className="h-16 object-contain mx-auto"
                          />
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="primaryColor">Cor Primária</Label>
                    <div className="flex gap-2">
                      <Input 
                        id="primaryColor" 
                        name="primaryColor" 
                        value={config.primaryColor} 
                        onChange={handleChange} 
                        placeholder="#8b5cf6"
                      />
                      <Input 
                        type="color" 
                        className="w-12 p-1" 
                        value={config.primaryColor} 
                        onChange={(e) => {
                          setConfig({...config, primaryColor: e.target.value});
                        }} 
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="accentColor">Cor de Destaque</Label>
                    <div className="flex gap-2">
                      <Input 
                        id="accentColor" 
                        name="accentColor" 
                        value={config.accentColor || ''}
                        onChange={handleChange} 
                        placeholder="#f97316"
                      />
                      <Input 
                        type="color" 
                        className="w-12 p-1" 
                        value={config.accentColor || '#f97316'} 
                        onChange={(e) => {
                          setConfig({...config, accentColor: e.target.value});
                        }} 
                      />
                    </div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="loginBackground">Imagem de Fundo da Página de Login</Label>
                  <div className="flex flex-col gap-3">
                    <div className="flex items-center gap-2">
                      <input
                        type="file"
                        ref={bgInputRef}
                        onChange={(e) => handleImageUpload(e, 'background')}
                        className="hidden"
                        accept="image/*"
                      />
                      <Button 
                        type="button" 
                        variant="outline"
                        onClick={() => bgInputRef.current?.click()}
                        className="flex items-center gap-2"
                      >
                        <ImageIcon size={16} /> Fazer upload
                      </Button>
                      <span className="text-sm text-muted-foreground">ou</span>
                      <Input 
                        id="loginBackground" 
                        name="loginBackground" 
                        value={typeof config.loginBackground === 'string' && !config.loginBackground.startsWith('data:') ? config.loginBackground : ''} 
                        onChange={handleChange} 
                        placeholder="https://example.com/background.jpg"
                        className="flex-1"
                      />
                    </div>
                    
                    {bgPreview && (
                      <div className="relative border rounded-md p-3 mt-2 bg-muted/20">
                        <p className="text-xs mb-2 text-muted-foreground">Pré-visualização:</p>
                        <img 
                          src={bgPreview} 
                          alt="Background preview" 
                          className="w-full h-40 object-cover rounded-md"
                        />
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="tagline">Slogan</Label>
                    <Input 
                      id="tagline" 
                      name="tagline" 
                      value={config.tagline || ''} 
                      onChange={handleChange} 
                      placeholder="Gerencie seus negócios com eficiência"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="description">Descrição</Label>
                    <Input 
                      id="description" 
                      name="description" 
                      value={config.description || ''} 
                      onChange={handleChange} 
                      placeholder="Plataforma completa de gestão"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="philosophicalQuote">Citação Filosófica</Label>
                  <Textarea 
                    id="philosophicalQuote" 
                    name="philosophicalQuote" 
                    value={config.philosophicalQuote || ''} 
                    onChange={handleChange} 
                    placeholder="O conhecimento é o único bem que se multiplica quando compartilhado. — Francis Bacon"
                    className="resize-none h-20"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Uma citação inspiradora sobre conhecimento ou informação para exibir na tela de login.
                  </p>
                </div>
              </CardContent>
              <CardFooter>
                <Button type="submit">Salvar Alterações</Button>
              </CardFooter>
            </Card>
          </form>
        </TabsContent>
        
        <TabsContent value="api">
          <Card>
            <CardHeader>
              <CardTitle>Configurações de API</CardTitle>
              <CardDescription>
                Configure suas integrações e chaves de API.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">Esta seção está disponível apenas para administradores.</p>
              
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="aiderUrl">URL do Servidor AIDER</Label>
                  <Input 
                    id="aiderUrl" 
                    placeholder="https://seu-servidor-aider.com" 
                    defaultValue={localStorage.getItem('aiderServerUrl') || ''}
                    onChange={(e) => localStorage.setItem('aiderServerUrl', e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="openaiApiKey">OpenAI API Key</Label>
                  <Input 
                    id="openaiApiKey" 
                    type="password" 
                    placeholder="sk-..." 
                    defaultValue=""
                  />
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button>Salvar Configurações de API</Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="users">
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
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Settings;
