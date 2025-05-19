
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Edit, Save } from 'lucide-react';
import { AffiliateAttribute } from './types';

interface AttributeEditorProps {
  attribute: AffiliateAttribute;
  editingAttribute: AffiliateAttribute | null;
  newAttributeValue: string;
  onEdit: (attribute: AffiliateAttribute) => void;
  onSave: () => void;
  onCancel: () => void;
  onValueChange: (value: string) => void;
}

const AttributeEditor: React.FC<AttributeEditorProps> = ({
  attribute,
  editingAttribute,
  newAttributeValue,
  onEdit,
  onSave,
  onCancel,
  onValueChange
}) => {
  const isEditing = editingAttribute && editingAttribute.id === attribute.id;
  
  return (
    <div className="grid grid-cols-3 items-center py-2 border-b">
      <div className="font-medium">{attribute.name}</div>
      
      {isEditing ? (
        <div>
          <Input 
            value={newAttributeValue} 
            onChange={(e) => onValueChange(e.target.value)}
            className="max-w-[200px]"
          />
        </div>
      ) : (
        <div>{attribute.value}</div>
      )}
      
      <div>
        {isEditing ? (
          <div className="flex space-x-2">
            <Button size="sm" variant="outline" onClick={onCancel}>
              Cancelar
            </Button>
            <Button size="sm" onClick={onSave}>
              <Save className="h-4 w-4 mr-2" />
              Salvar
            </Button>
          </div>
        ) : (
          <Button size="sm" variant="outline" onClick={() => onEdit(attribute)}>
            <Edit className="h-4 w-4 mr-2" />
            Editar
          </Button>
        )}
      </div>
    </div>
  );
};

export default AttributeEditor;
