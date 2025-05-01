
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useGoalsData } from '../hooks/useGoalsData';

export const SalesGoals: React.FC = () => {
  const { teamGoals, sellerGoals, dailyGoals } = useGoalsData();

  return (
    <div className="space-y-4">
      <Tabs defaultValue="team">
        <TabsList className="w-full grid grid-cols-3">
          <TabsTrigger value="team">Metas do Setor</TabsTrigger>
          <TabsTrigger value="sellers">Metas por Vendedor</TabsTrigger>
          <TabsTrigger value="daily">Metas Diárias</TabsTrigger>
        </TabsList>

        <TabsContent value="team" className="space-y-4 pt-4">
          <div className="grid gap-4 md:grid-cols-2">
            {teamGoals.map((goal, index) => (
              <Card key={index}>
                <CardHeader className="pb-2">
                  <CardTitle>{goal.name}</CardTitle>
                  <CardDescription>{goal.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm font-medium">Progresso</span>
                    <span className="text-sm font-medium">{goal.progress}%</span>
                  </div>
                  <Progress value={goal.progress} className="h-2" />
                  <div className="flex justify-between mt-2 text-sm text-muted-foreground">
                    <span>Atual: R$ {goal.current.toLocaleString('pt-BR')}</span>
                    <span>Meta: R$ {goal.target.toLocaleString('pt-BR')}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="sellers" className="space-y-4 pt-4">
          <div className="grid gap-4 md:grid-cols-2">
            {sellerGoals.map((seller, index) => (
              <Card key={index}>
                <CardHeader className="pb-2">
                  <CardTitle>{seller.name}</CardTitle>
                  <CardDescription>Meta mensal: R$ {seller.target.toLocaleString('pt-BR')}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm font-medium">Progresso</span>
                    <span className="text-sm font-medium">{seller.progress}%</span>
                  </div>
                  <Progress value={seller.progress} className="h-2" />
                  <div className="flex justify-between mt-2 text-sm text-muted-foreground">
                    <span>Atual: R$ {seller.current.toLocaleString('pt-BR')}</span>
                    <span>Restante: R$ {(seller.target - seller.current).toLocaleString('pt-BR')}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="daily" className="space-y-4 pt-4">
          <Card>
            <CardHeader>
              <CardTitle>Desempenho Diário</CardTitle>
              <CardDescription>Progresso das metas diárias para o mês atual</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {dailyGoals.map((day, index) => (
                  <div key={index} className="space-y-1">
                    <div className="flex justify-between">
                      <span className="text-sm font-medium">{day.date}</span>
                      <span className="text-sm">{day.progress}%</span>
                    </div>
                    <Progress value={day.progress} className="h-2" />
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>Vendas: {day.sales}</span>
                      <span>Total: R$ {day.value.toLocaleString('pt-BR')}</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
