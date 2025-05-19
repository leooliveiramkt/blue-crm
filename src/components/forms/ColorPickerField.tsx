
import React from 'react';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

interface ColorPickerFieldProps {
  label: string;
  name: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  description?: string;
}

const ColorPickerField = ({ 
  label, 
  name, 
  value, 
  onChange,
  placeholder,
  description
}: ColorPickerFieldProps) => {
  // Utiliza o valor default para o color picker se o valor atual não for válido
  const safeValue = React.useMemo(() => {
    // Verifica se o valor é uma cor hexadecimal válida
    const isValidHex = /^#([0-9A-F]{3}){1,2}$/i.test(value);
    return isValidHex ? value : "#ffffff";
  }, [value]);

  return (
    <div className="space-y-2">
      <Label htmlFor={name}>{label}</Label>
      <div className="flex gap-2 items-center">
        <Input 
          id={name} 
          name={name} 
          value={value} 
          onChange={(e) => onChange(e.target.value)} 
          placeholder={placeholder}
          className="flex-1"
        />
        <Input 
          type="color" 
          className="w-12 p-1 h-10 cursor-pointer" 
          value={safeValue} 
          onChange={(e) => onChange(e.target.value)} 
          aria-label={`Seletor de cor para ${label}`}
        />
        {value && (
          <div 
            className="w-6 h-6 rounded-full border border-gray-300" 
            style={{ backgroundColor: value }} 
            title={value}
            aria-hidden="true"
          />
        )}
      </div>
      {description && (
        <p className="text-xs text-muted-foreground">{description}</p>
      )}
    </div>
  );
};

export default ColorPickerField;
