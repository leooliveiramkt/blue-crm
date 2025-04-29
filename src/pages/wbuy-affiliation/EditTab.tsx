
import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertCircle } from 'lucide-react';
import AttributeEditor from './AttributeEditor';
import { Affiliate, AffiliateAttribute } from './types';

interface EditTabProps {
  affiliate: Affiliate;
  editingAttribute: AffiliateAttribute | null;
  newAttributeValue: string;
  onEditAttribute: (attribute: AffiliateAttribute) => void;
  onCancelEdit: () => void;
  onSaveAttribute: () => void;
  onNewAttributeValueChange: (value: string) => void;
  onBack: () => void;
}

const EditTab: React.FC<EditTabProps> = ({
  affiliate,
  editingAttribute,
  newAttributeValue,
  onEditAttribute,
  onCancelEdit,
  onSaveAttribute,
  onNewAttributeValueChange,
  onBack
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Editar Atributos</CardTitle>
        <CardDescription>
          Modifique os atributos do afiliado {affiliate.name}.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="p-3 bg-blue-50 text-blue-700 rounded flex items-start">
          <AlertCircle className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-medium">Importante</p>
            <p className="text-sm">
              As alterações nos atributos serão refletidas imediatamente nas operações da Wbuy.
            </p>
          </div>
        </div>

        <div className="space-y-4 mt-4">
          <div className="grid grid-cols-3 font-medium text-sm text-muted-foreground py-2 border-b">
            <div>Nome do Atributo</div>
            <div>Valor</div>
            <div>Ações</div>
          </div>

          {affiliate.attributes.map((attribute) => (
            <AttributeEditor
              key={attribute.id}
              attribute={attribute}
              editingAttribute={editingAttribute}
              newAttributeValue={newAttributeValue}
              onEdit={onEditAttribute}
              onSave={onSaveAttribute}
              onCancel={onCancelEdit}
              onValueChange={onNewAttributeValueChange}
            />
          ))}
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={onBack}>
          Voltar para Busca
        </Button>
      </CardFooter>
    </Card>
  );
};

export default EditTab;
