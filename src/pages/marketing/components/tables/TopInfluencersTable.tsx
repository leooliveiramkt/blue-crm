
import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface TopInfluencerData {
  id: number;
  name: string;
  platform: string;
  revenue: number;
  followers: number;
}

interface TopInfluencersTableProps {
  data: TopInfluencerData[];
}

const TopInfluencersTable = ({ data }: TopInfluencersTableProps) => {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', { 
      style: 'currency', 
      currency: 'BRL',
      maximumFractionDigits: 0
    }).format(value);
  };

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Influenciador</TableHead>
          <TableHead>Plataforma</TableHead>
          <TableHead className="text-right">Seguidores</TableHead>
          <TableHead className="text-right">Faturamento</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.map((influencer) => (
          <TableRow key={influencer.id}>
            <TableCell className="font-medium">{influencer.name}</TableCell>
            <TableCell>{influencer.platform}</TableCell>
            <TableCell className="text-right">{(influencer.followers / 1000000).toFixed(1)}M</TableCell>
            <TableCell className="text-right">{formatCurrency(influencer.revenue)}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default TopInfluencersTable;
