
import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import AffiliateSearchForm from './AffiliateSearchForm';
import AffiliateCard from './AffiliateCard';
import { Affiliate } from './types';

interface SearchTabProps {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  searchAffiliates: () => void;
  searching: boolean;
  affiliates: Affiliate[];
  onEdit: (affiliate: Affiliate) => void;
}

const SearchTab: React.FC<SearchTabProps> = ({
  searchTerm,
  setSearchTerm,
  searchAffiliates,
  searching,
  affiliates,
  onEdit
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Buscar Afiliados</CardTitle>
        <CardDescription>
          Busque afiliados por nome, email ou documento.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <AffiliateSearchForm
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          searchAffiliates={searchAffiliates}
          searching={searching}
        />

        {affiliates.length > 0 && (
          <div className="space-y-4 mt-4">
            <h3 className="text-lg font-medium">Resultados da Busca</h3>
            {affiliates.map((affiliate) => (
              <AffiliateCard
                key={affiliate.id}
                affiliate={affiliate}
                onEdit={onEdit}
              />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default SearchTab;
