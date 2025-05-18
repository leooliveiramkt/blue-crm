
import React from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { ApiKeyFormProps } from '../types';

export const ApiKeyForm: React.FC<ApiKeyFormProps> = ({
  id,
  name,
  connected,
  defaultValue,
  onSave
}) => {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <Label htmlFor={`${id}-api-key`} className="flex items-center gap-2">
          {name}
        </Label>
        <span className={`text-xs font-medium ${connected ? "text-green-600" : "text-amber-600"}`}>
          {connected ? "Ativo" : "Inativo"}
        </span>
      </div>
      <div className="flex gap-2">
        <Input
          id={`${id}-api-key`}
          type="text"
          placeholder={connected ? "••••••••••••••••" : "Insira sua chave API"}
          defaultValue={defaultValue}
        />
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => {
            const input = document.getElementById(`${id}-api-key`) as HTMLInputElement;
            onSave(id, input.value);
          }}
        >
          Salvar
        </Button>
      </div>
    </div>
  );
};
