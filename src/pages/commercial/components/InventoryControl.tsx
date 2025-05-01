
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useInventoryData } from '../hooks/useInventoryData';

export const InventoryControl: React.FC = () => {
  const { inventory, lowStockItems } = useInventoryData();
  const [searchTerm, setSearchTerm] = React.useState('');

  const filteredInventory = inventory.filter(item => 
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <Card className="col-span-full">
        <CardHeader>
          <CardTitle>Controle de Estoque</CardTitle>
          <CardDescription>Gerencie seu inventário e monitore níveis de estoque</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-2 mb-4">
            <Input
              placeholder="Buscar produtos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-sm"
            />
            <Button variant="outline">Filtrar</Button>
            <Button>Adicionar Item</Button>
          </div>
          
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Produto</TableHead>
                <TableHead>SKU</TableHead>
                <TableHead>Categoria</TableHead>
                <TableHead className="text-right">Qtd. Atual</TableHead>
                <TableHead className="text-right">Qtd. Mínima</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Última Atualização</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredInventory.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">{item.name}</TableCell>
                  <TableCell>{item.sku}</TableCell>
                  <TableCell>{item.category}</TableCell>
                  <TableCell className="text-right">{item.quantity}</TableCell>
                  <TableCell className="text-right">{item.minQuantity}</TableCell>
                  <TableCell>
                    <Badge variant={
                      item.quantity > item.minQuantity * 2 ? "default" :
                      item.quantity > item.minQuantity ? "outline" : "destructive"
                    }>
                      {item.quantity > item.minQuantity * 2 ? "OK" :
                       item.quantity > item.minQuantity ? "Baixo" : "Crítico"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">{item.lastUpdated}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Itens com Estoque Baixo</CardTitle>
          <CardDescription>Produtos que precisam de reposição</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Produto</TableHead>
                <TableHead>Quantidade Atual</TableHead>
                <TableHead>Fornecedor</TableHead>
                <TableHead>Tempo para Reposição</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {lowStockItems.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">{item.name}</TableCell>
                  <TableCell>{item.quantity}</TableCell>
                  <TableCell>{item.supplier}</TableCell>
                  <TableCell>{item.restockTime} dias</TableCell>
                  <TableCell>
                    <Badge variant={item.status === 'Crítico' ? "destructive" : "outline"}>
                      {item.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="outline" size="sm">
                      Solicitar
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};
