import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { useProductsData } from '../hooks/useProductsData';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

export const ProductAnalytics: React.FC = () => {
  const { topProducts, lowProducts, productCategories, abcAnalysis } = useProductsData();
  
  const COLORS = ['#9b87f5', '#7E69AB', '#6E59A5', '#F2FCE2', '#FEF7CD', '#FEC6A1'];
  
  return (
    <div className="space-y-4">
      <Tabs defaultValue="top">
        <TabsList className="w-full grid grid-cols-4">
          <TabsTrigger value="top">Mais Vendidos</TabsTrigger>
          <TabsTrigger value="bottom">Menos Vendidos</TabsTrigger>
          <TabsTrigger value="categories">Categorias</TabsTrigger>
          <TabsTrigger value="abc">Curva ABC</TabsTrigger>
        </TabsList>

        <TabsContent value="top" className="space-y-4 pt-4">
          <Card>
            <CardHeader>
              <CardTitle>Produtos Mais Vendidos</CardTitle>
              <CardDescription>Os produtos com melhor desempenho no último mês</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Produto</TableHead>
                    <TableHead>Quantidade</TableHead>
                    <TableHead>Valor Total</TableHead>
                    <TableHead>% das Vendas</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {topProducts.map((product, index) => (
                    <TableRow key={index} className={index % 2 === 0 ? 'bg-secondary/20' : 'bg-white'}>
                      <TableCell className="font-medium">{product.name}</TableCell>
                      <TableCell>{product.quantity}</TableCell>
                      <TableCell>R$ {product.value.toLocaleString('pt-BR')}</TableCell>
                      <TableCell>{product.percentage}%</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="bottom" className="space-y-4 pt-4">
          <Card>
            <CardHeader>
              <CardTitle>Produtos Menos Vendidos</CardTitle>
              <CardDescription>Os produtos com menor desempenho no último mês</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Produto</TableHead>
                    <TableHead>Quantidade</TableHead>
                    <TableHead>Valor Total</TableHead>
                    <TableHead>Dias sem venda</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {lowProducts.map((product, index) => (
                    <TableRow key={index} className={index % 2 === 0 ? 'bg-secondary/20' : 'bg-white'}>
                      <TableCell className="font-medium">{product.name}</TableCell>
                      <TableCell>{product.quantity}</TableCell>
                      <TableCell>R$ {product.value.toLocaleString('pt-BR')}</TableCell>
                      <TableCell>{product.daysSinceLastSale}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="categories" className="space-y-4 pt-4">
          <div className="grid md:grid-cols-2 gap-4">
            <Card className="md:col-span-1">
              <CardHeader>
                <CardTitle>Distribuição por Categoria</CardTitle>
                <CardDescription>Vendas por categoria de produto</CardDescription>
              </CardHeader>
              <CardContent className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      dataKey="value"
                      data={productCategories}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      fill="#8884d8"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {productCategories.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => [`R$ ${value.toLocaleString('pt-BR')}`, "Valor"]} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
            
            <Card className="md:col-span-1">
              <CardHeader>
                <CardTitle>Detalhes por Categoria</CardTitle>
                <CardDescription>Desempenho detalhado por categoria</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {productCategories.map((category, index) => (
                    <div key={index} className="space-y-1">
                      <div className="flex justify-between">
                        <span className="text-sm font-medium">{category.name}</span>
                        <span className="text-sm">R$ {category.value.toLocaleString('pt-BR')}</span>
                      </div>
                      <Progress value={category.percentage} className="h-2" />
                      <div className="text-xs text-muted-foreground">
                        {category.percentage}% das vendas totais
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="abc" className="space-y-4 pt-4">
          <Card>
            <CardHeader>
              <CardTitle>Análise Curva ABC</CardTitle>
              <CardDescription>Classificação de produtos por impacto nas vendas</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Produto</TableHead>
                    <TableHead>Valor Total</TableHead>
                    <TableHead>% Acumulado</TableHead>
                    <TableHead>Classificação</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {abcAnalysis.map((product, index) => (
                    <TableRow key={index} className={index % 2 === 0 ? 'bg-secondary/20' : 'bg-white'}>
                      <TableCell className="font-medium">{product.name}</TableCell>
                      <TableCell>R$ {product.value.toLocaleString('pt-BR')}</TableCell>
                      <TableCell>{product.accumPercentage}%</TableCell>
                      <TableCell>
                        <Badge variant={
                          product.classification === 'A' ? "default" :
                          product.classification === 'B' ? "outline" : "secondary"
                        }>
                          Classe {product.classification}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
