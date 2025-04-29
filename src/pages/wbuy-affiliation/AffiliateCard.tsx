
import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Edit, Users } from 'lucide-react';
import { Affiliate } from './types';

interface AffiliateCardProps {
  affiliate: Affiliate;
  onEdit: (affiliate: Affiliate) => void;
}

const AffiliateCard: React.FC<AffiliateCardProps> = ({ affiliate, onEdit }) => {
  return (
    <Card key={affiliate.id} className="overflow-hidden">
      <div className="flex">
        <div className="flex-1 p-4">
          <div className="flex items-center space-x-2">
            <Users className="h-4 w-4 text-muted-foreground" />
            <h4 className="text-md font-medium">{affiliate.name}</h4>
          </div>
          <div className="mt-2 space-y-1 text-sm text-muted-foreground">
            <p>Email: {affiliate.email}</p>
            <p>Documento: {affiliate.document}</p>
            <p>Status: {affiliate.status === 'active' ? 'Ativo' : 'Inativo'}</p>
          </div>
        </div>
        <div className="flex items-center pr-4">
          <Button variant="outline" size="sm" onClick={() => onEdit(affiliate)}>
            <Edit className="h-4 w-4 mr-2" />
            Editar
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default AffiliateCard;
