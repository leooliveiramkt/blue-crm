
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Loader2 } from "lucide-react";
import { ThemeConfigType } from "@/types/theme";
import ImageUploadField from '@/components/forms/ImageUploadField';
import ColorPickerField from '@/components/forms/ColorPickerField';

interface BrandingFormProps {
  config: ThemeConfigType;
  onSubmit: (config: ThemeConfigType) => Promise<void>;
  isSaving: boolean;
}

const BrandingForm = ({ config, onSubmit, isSaving }: BrandingFormProps) => {
  const [formConfig, setFormConfig] = useState(config);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormConfig({
      ...formConfig,
      [name]: value
    });
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
            
            <ImageUploadField
              label="Logo da Empresa"
              name="logo"
              value={formConfig.logo}
              onChange={(value) => setFormConfig({ ...formConfig, logo: value })}
              placeholder="https://example.com/logo.png"
            />

            <ColorPickerField
              label="Cor Primária"
              name="primaryColor"
              value={formConfig.primaryColor}
              onChange={(value) => setFormConfig({ ...formConfig, primaryColor: value })}
              placeholder="#8b5cf6"
            />
            
            <ColorPickerField
              label="Cor de Destaque"
              name="accentColor"
              value={formConfig.accentColor || ''}
              onChange={(value) => setFormConfig({ ...formConfig, accentColor: value })}
              placeholder="#f97316"
            />
          </div>

          <ImageUploadField
            label="Imagem de Fundo da Página de Login"
            name="loginBackground"
            value={formConfig.loginBackground}
            onChange={(value) => setFormConfig({ ...formConfig, loginBackground: value })}
            placeholder="https://example.com/background.jpg"
          />

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
