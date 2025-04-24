
import React from 'react';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

interface ColorPickerFieldProps {
  label: string;
  name: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

const ColorPickerField = ({ 
  label, 
  name, 
  value, 
  onChange,
  placeholder 
}: ColorPickerFieldProps) => {
  return (
    <div className="space-y-2">
      <Label htmlFor={name}>{label}</Label>
      <div className="flex gap-2">
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
          className="w-12 p-1" 
          value={value} 
          onChange={(e) => onChange(e.target.value)} 
        />
      </div>
    </div>
  );
};

export default ColorPickerField;
