
import React, { useRef, useState } from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Upload, ImageIcon, Loader2 } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { ThemeConfigType } from "@/types/theme";

interface BrandingFormProps {
  config: ThemeConfigType;
  onSubmit: (config: ThemeConfigType) => Promise<void>;
  isSaving: boolean;
}

const BrandingForm = ({ config, onSubmit, isSaving }: BrandingFormProps) => {
  const { toast } = useToast();
  const [formConfig, setFormConfig] = useState(config);
  const [logoPreview, setLogoPreview] = useState<string | undefined>(config.logo);
  const [bgPreview, setBgPreview] = useState<string | undefined>(config.loginBackground);
  const logoInputRef = useRef<HTMLInputElement>(null);
  const bgInputRef = useRef<HTMLInputElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormConfig({
      ...formConfig,
      [name]: value
    });
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, type: 'logo' | 'background') => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      toast({
        title: "Erro de upload",
        description: "O arquivo é muito grande. O tamanho máximo é de 2MB.",
        variant: "destructive",
      });
      return;
    }

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
          setFormConfig({
            ...formConfig,
            logo: imageDataUrl
          });
        } else {
          setBgPreview(imageDataUrl);
          setFormConfig({
            ...formConfig,
            loginBackground: imageDataUrl
          });
        }
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(formConfig);
  };

  return (
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
                value={formConfig.companyName} 
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
                    value={typeof formConfig.logo === 'string' && !formConfig.logo.startsWith('data:') ? formConfig.logo : ''} 
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
                  value={formConfig.primaryColor} 
                  onChange={handleChange} 
                  placeholder="#8b5cf6"
                />
                <Input 
                  type="color" 
                  className="w-12 p-1" 
                  value={formConfig.primaryColor} 
                  onChange={(e) => {
                    setFormConfig({...formConfig, primaryColor: e.target.value});
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
                  value={formConfig.accentColor || ''} 
                  onChange={handleChange} 
                  placeholder="#f97316"
                />
                <Input 
                  type="color" 
                  className="w-12 p-1" 
                  value={formConfig.accentColor || '#f97316'} 
                  onChange={(e) => {
                    setFormConfig({...formConfig, accentColor: e.target.value});
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
                  value={typeof formConfig.loginBackground === 'string' && !formConfig.loginBackground.startsWith('data:') ? formConfig.loginBackground : ''} 
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
                value={formConfig.tagline || ''} 
                onChange={handleChange} 
                placeholder="Gerencie seus negócios com eficiência"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="description">Descrição</Label>
              <Input 
                id="description" 
                name="description" 
                value={formConfig.description || ''} 
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
              value={formConfig.philosophicalQuote || ''} 
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
          <Button type="submit" disabled={isSaving}>
            {isSaving ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Salvando...
              </>
            ) : (
              'Salvar Alterações'
            )}
          </Button>
        </CardFooter>
      </Card>
    </form>
  );
};

export default BrandingForm;
