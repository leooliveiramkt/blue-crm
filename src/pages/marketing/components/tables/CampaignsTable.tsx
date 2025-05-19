
import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface Campaign {
  id: number;
  name: string;
  platform: string;
  revenue: number;
  investment: number;
  roi: number;
}

interface CampaignsTableProps {
  data: Campaign[];
  limit?: number;
}

const CampaignsTable = ({ data, limit }: CampaignsTableProps) => {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', { 
      style: 'currency', 
      currency: 'BRL',
      maximumFractionDigits: 0
    }).format(value);
  };

  const displayData = limit ? data.slice(0, limit) : data;

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Campanha</TableHead>
          <TableHead>Plataforma</TableHead>
          <TableHead className="text-right">Faturamento</TableHead>
          <TableHead className="text-right">ROI</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {displayData.map((campaign) => (
          <TableRow key={campaign.id}>
            <TableCell className="font-medium">{campaign.name}</TableCell>
            <TableCell>{campaign.platform}</TableCell>
            <TableCell className="text-right">{formatCurrency(campaign.revenue)}</TableCell>
            <TableCell className="text-right text-green-600 font-medium">{campaign.roi}x</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default CampaignsTable;
