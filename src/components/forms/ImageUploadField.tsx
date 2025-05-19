
import React, { useRef, useState } from 'react';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Upload, ImageIcon } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface ImageUploadFieldProps {
  label: string;
  name: string;
  value?: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

const ImageUploadField = ({ 
  label, 
  name, 
  value, 
  onChange, 
  placeholder 
}: ImageUploadFieldProps) => {
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | undefined>(value);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
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
        setPreview(imageDataUrl);
        onChange(imageDataUrl);
      }
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="space-y-2">
      <Label htmlFor={name}>{label}</Label>
      <div className="flex flex-col gap-3">
        <div className="flex items-center gap-2">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleImageUpload}
            className="hidden"
            accept="image/*"
          />
          <Button 
            type="button" 
            variant="outline"
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center gap-2"
          >
            <Upload size={16} /> Fazer upload
          </Button>
          <span className="text-sm text-muted-foreground">ou</span>
          <Input 
            id={name} 
            name={name} 
            value={typeof value === 'string' && !value.startsWith('data:') ? value : ''} 
            onChange={(e) => onChange(e.target.value)} 
            placeholder={placeholder}
            className="flex-1"
          />
        </div>
        
        {preview && (
          <div className="relative border rounded-md p-3 mt-2 bg-muted/20">
            <p className="text-xs mb-2 text-muted-foreground">Pré-visualização:</p>
            <img 
              src={preview} 
              alt={`${label} preview`} 
              className="h-16 object-contain mx-auto"
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default ImageUploadField;
