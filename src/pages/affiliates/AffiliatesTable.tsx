
import React, { useState } from 'react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, Edit, User } from "lucide-react";

interface Affiliate {
  id: string;
  full_name: string;
  email: string;
  status: string;
  experience_level: string;
  registration_date: string;
}

interface AffiliatesTableProps {
  affiliates: Affiliate[];
  onSelectAffiliate: (id: string) => void;
}

const AffiliatesTable: React.FC<AffiliatesTableProps> = ({ 
  affiliates,
  onSelectAffiliate
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  
  const filteredAffiliates = affiliates.filter(affiliate =>
    affiliate.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    affiliate.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'active': return 'bg-green-500';
      case 'vip': return 'bg-indigo-500';
      case 'new': return 'bg-blue-500';
      case 'potential': return 'bg-yellow-500';
      case 'inactive': return 'bg-gray-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusLabel = (status: string) => {
    switch(status) {
      case 'active': return 'Ativo';
      case 'vip': return 'VIP';
      case 'new': return 'Novo';
      case 'potential': return 'Potencial';
      case 'inactive': return 'Inativo';
      default: return status;
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar afiliado..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Nível</TableHead>
              <TableHead>Data de Registro</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredAffiliates.length > 0 ? (
              filteredAffiliates.map((affiliate) => (
                <TableRow key={affiliate.id}>
                  <TableCell className="font-medium">{affiliate.full_name}</TableCell>
                  <TableCell>{affiliate.email}</TableCell>
                  <TableCell>
                    <Badge 
                      variant="secondary"
                      className={`${getStatusColor(affiliate.status)} text-white`}
                    >
                      {getStatusLabel(affiliate.status)}
                    </Badge>
                  </TableCell>
                  <TableCell className="capitalize">{affiliate.experience_level || 'N/A'}</TableCell>
                  <TableCell>
                    {new Date(affiliate.registration_date).toLocaleDateString('pt-BR')}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button 
                      variant="ghost" 
                      size="icon"
                      onClick={() => onSelectAffiliate(affiliate.id)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="text-center h-24">
                  {searchTerm ? (
                    <div className="flex flex-col items-center justify-center text-muted-foreground">
                      <Search className="h-8 w-8 mb-2 opacity-50" />
                      <p>Nenhum afiliado encontrado</p>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center text-muted-foreground">
                      <User className="h-8 w-8 mb-2 opacity-50" />
                      <p>Nenhum afiliado cadastrado</p>
                    </div>
                  )}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default AffiliatesTable;
