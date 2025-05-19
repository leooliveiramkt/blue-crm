
import React from 'react';
import { Search, RefreshCw } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface CommissionSearchFormProps {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  selectedFilter: string;
  setSelectedFilter: (value: string) => void;
  handleSearch: () => void;
  isSearching: boolean;
}

const CommissionSearchForm: React.FC<CommissionSearchFormProps> = ({
  searchTerm,
  setSearchTerm,
  selectedFilter,
  setSelectedFilter,
  handleSearch,
  isSearching
}) => {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <p className="text-sm font-medium">Filtrar por</p>
        <Select value={selectedFilter} onValueChange={setSelectedFilter}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Selecione um filtro" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="name">Nome/Email</SelectItem>
            <SelectItem value="code">Código de afiliado</SelectItem>
            <SelectItem value="commission">Percentual de comissão</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <p className="text-sm font-medium">
          {selectedFilter === 'name' 
            ? 'Nome ou email do afiliado' 
            : selectedFilter === 'code' 
              ? 'Código de afiliado' 
              : 'Percentual de comissão'}
        </p>
        <div className="flex gap-2">
          <Input
            placeholder={
              selectedFilter === 'name' 
                ? 'Ex: João Silva' 
                : selectedFilter === 'code' 
                  ? 'Ex: ABC123' 
                  : 'Ex: 10%'
            }
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
          />
          <Button onClick={handleSearch} disabled={isSearching}>
            {isSearching ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4 mr-2" />}
            {isSearching ? 'Buscando...' : 'Buscar'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CommissionSearchForm;
