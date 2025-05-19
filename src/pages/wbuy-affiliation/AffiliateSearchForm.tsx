
import React from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, RefreshCw } from 'lucide-react';

interface AffiliateSearchFormProps {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  searchAffiliates: () => void;
  searching: boolean;
}

const AffiliateSearchForm: React.FC<AffiliateSearchFormProps> = ({
  searchTerm,
  setSearchTerm,
  searchAffiliates,
  searching
}) => {
  return (
    <div className="flex space-x-2">
      <div className="flex-1">
        <Input
          placeholder="Digite nome, email ou documento"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && searchAffiliates()}
        />
      </div>
      <Button onClick={searchAffiliates} disabled={searching}>
        {searching ? <RefreshCw className="h-4 w-4 animate-spin mr-2" /> : <Search className="h-4 w-4 mr-2" />}
        {searching ? 'Buscando...' : 'Buscar'}
      </Button>
    </div>
  );
};

export default AffiliateSearchForm;
