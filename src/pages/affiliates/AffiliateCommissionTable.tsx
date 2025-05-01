
import React from 'react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { Search, User } from "lucide-react";

interface Affiliate {
  id: string;
  full_name: string;
  email: string;
  commission?: string;
  affiliate_code?: string;
}

interface AffiliateCommissionTableProps {
  affiliates: Affiliate[];
  selectedAffiliates: Affiliate[];
  onToggleSelect: (affiliate: Affiliate) => void;
  isLoading: boolean;
}

const AffiliateCommissionTable: React.FC<AffiliateCommissionTableProps> = ({ 
  affiliates,
  selectedAffiliates,
  onToggleSelect,
  isLoading
}) => {
  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader className="bg-muted/30">
          <TableRow>
            <TableHead className="w-12"></TableHead>
            <TableHead>Nome</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Código</TableHead>
            <TableHead className="text-right">Comissão Atual</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            <TableRow>
              <TableCell colSpan={5} className="h-24 text-center">
                <div className="flex flex-col items-center justify-center">
                  <Search className="h-8 w-8 mb-3 animate-pulse text-muted-foreground" />
                  <p className="text-muted-foreground">Buscando afiliados...</p>
                </div>
              </TableCell>
            </TableRow>
          ) : affiliates.length > 0 ? (
            affiliates.map((affiliate) => {
              const isSelected = selectedAffiliates.some(a => a.id === affiliate.id);
              
              return (
                <TableRow 
                  key={affiliate.id} 
                  className={`transition-colors ${isSelected ? 'bg-primary/5' : ''} hover:bg-muted/20`}
                >
                  <TableCell>
                    <Checkbox 
                      checked={isSelected}
                      onCheckedChange={() => onToggleSelect(affiliate)}
                    />
                  </TableCell>
                  <TableCell className="font-medium">{affiliate.full_name}</TableCell>
                  <TableCell>{affiliate.email}</TableCell>
                  <TableCell className="font-mono">{affiliate.affiliate_code}</TableCell>
                  <TableCell className="text-right font-medium">{affiliate.commission}</TableCell>
                </TableRow>
              );
            })
          ) : (
            <TableRow>
              <TableCell colSpan={5} className="h-24 text-center">
                <div className="flex flex-col items-center justify-center">
                  <User className="h-8 w-8 mb-2 opacity-50" />
                  <p className="text-muted-foreground">Nenhum afiliado encontrado</p>
                </div>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default AffiliateCommissionTable;
