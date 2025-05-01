
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Loader2, SearchIcon, CircleAlert } from 'lucide-react';

interface SearchOrderFormProps {
  orderCode: string;
  setOrderCode: (value: string) => void;
  handleSearch: () => void;
  isSearching: boolean;
  error: string | null;
}

export const SearchOrderForm: React.FC<SearchOrderFormProps> = ({
  orderCode,
  setOrderCode,
  handleSearch,
  isSearching,
  error,
}) => {
  return (
    <Card className="overflow-hidden">
      <div className="h-2 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"></div>
      <CardHeader>
        <CardTitle>Consultar Pedido</CardTitle>
        <CardDescription>
          Digite o número do pedido para rastrear sua origem e atribuição
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex space-x-2">
          <Input
            placeholder="Digite o código do pedido (ex: WB-12345)"
            value={orderCode}
            onChange={(e) => setOrderCode(e.target.value)}
            className="flex-1"
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
          />
          <Button 
            onClick={handleSearch} 
            disabled={isSearching}
            className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700"
          >
            {isSearching ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Buscando...
              </>
            ) : (
              <>
                <SearchIcon className="mr-2 h-4 w-4" />
                Buscar
              </>
            )}
          </Button>
        </div>

        {error && (
          <div className="mt-4 p-4 bg-destructive/10 text-destructive rounded-md flex items-center">
            <CircleAlert className="h-5 w-5 mr-2" />
            {error}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
