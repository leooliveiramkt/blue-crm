
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { InfoIcon } from 'lucide-react';

export const InfoCard: React.FC = () => {
  return (
    <Card className="bg-gradient-to-r from-gray-50 to-slate-50 border-gray-200">
      <CardHeader className="flex flex-row items-center">
        <div>
          <CardTitle>Entenda o Rastreamento Multicanal</CardTitle>
          <CardDescription>Como funciona nossa tecnologia de atribuição de vendas</CardDescription>
        </div>
        <InfoIcon className="h-5 w-5 text-muted-foreground ml-auto" />
      </CardHeader>
      <CardContent>
        <div className="space-y-4 text-sm bg-white p-4 rounded-lg">
          <p>
            Nosso sistema de rastreamento utiliza tecnologia avançada para triangular dados de várias plataformas 
            (Wbuy, Active Campaign, Google Analytics e Stape.io) e determinar com precisão a origem de cada venda.
          </p>
          <p>
            <strong>Como funciona:</strong> Quando um visitante clica em um link de afiliado, armazenamos um cookie 
            com o código de referência (<code>?ref=CODIGO</code>). Este código é rastreado em todas as etapas da 
            jornada do cliente, desde o primeiro clique até a compra final.
          </p>
          <p>
            <strong>Triangulação de dados:</strong> Ao comparar os registros de diferentes plataformas, conseguimos 
            confirmar com alta precisão (99%+) a verdadeira origem da venda quando há correspondência em pelo menos 
            duas fontes distintas.
          </p>
          <p>
            <strong>Inteligência artificial:</strong> Nossa IA analisa todos os dados disponíveis e fornece 
            uma recomendação clara sobre a atribuição de venda, levando em consideração padrões complexos e 
            variáveis que poderiam passar despercebidos em uma análise manual.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
