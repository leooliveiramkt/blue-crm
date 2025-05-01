
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { CheckCircle2 } from 'lucide-react';
import { GlobalIcon, ClickIcon, TagIcon } from './icons/CustomIcons';

interface AttributionSummaryCardProps {
  summary: {
    firstClick: string;
    lastClick: string;
    affiliateCode: string;
    confidence: number;
    matchingPlatforms: string[];
  };
}

export const AttributionSummaryCard: React.FC<AttributionSummaryCardProps> = ({ summary }) => {
  return (
    <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-primary/30 overflow-hidden">
      <div className="h-2 bg-gradient-to-r from-blue-500 to-indigo-600"></div>
      <CardHeader>
        <CardTitle className="flex items-center">
          <CheckCircle2 className="h-5 w-5 mr-2 text-primary" />
          Resumo da Análise de Atribuição
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-white/80 rounded-lg shadow-sm">
              <h4 className="font-medium mb-2 text-primary">Origem do tráfego (First Click)</h4>
              <div className="flex items-center">
                <div className="p-2 bg-blue-100 rounded-full mr-2">
                  <GlobalIcon className="h-5 w-5 text-blue-700" />
                </div>
                <p className="text-lg font-semibold">{summary.firstClick}</p>
              </div>
            </div>
            <div className="p-4 bg-white/80 rounded-lg shadow-sm">
              <h4 className="font-medium mb-2 text-primary">Último click (Last Click)</h4>
              <div className="flex items-center">
                <div className="p-2 bg-indigo-100 rounded-full mr-2">
                  <ClickIcon className="h-5 w-5 text-indigo-700" />
                </div>
                <p className="text-lg font-semibold">{summary.lastClick}</p>
              </div>
            </div>
            <div className="p-4 bg-white/80 rounded-lg shadow-sm">
              <h4 className="font-medium mb-2 text-primary">Código de Afiliado</h4>
              <div className="flex items-center">
                <div className="p-2 bg-purple-100 rounded-full mr-2">
                  <TagIcon className="h-5 w-5 text-purple-700" />
                </div>
                <p className="text-lg font-semibold">{summary.affiliateCode}</p>
              </div>
            </div>
            <div className="p-4 bg-white/80 rounded-lg shadow-sm">
              <h4 className="font-medium mb-2 text-primary">Nível de Confiança</h4>
              <div className="space-y-2">
                <div className="flex justify-between mb-1">
                  <span className="text-lg font-semibold">{summary.confidence}%</span>
                  <Badge className={
                    summary.confidence >= 90 
                      ? "bg-green-100 text-green-800" 
                      : summary.confidence >= 60 
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-red-100 text-red-800"
                  }>
                    {summary.confidence >= 90 
                      ? "Alto" 
                      : summary.confidence >= 60 
                        ? "Médio" 
                        : "Baixo"}
                  </Badge>
                </div>
                <Progress value={summary.confidence} className={
                  summary.confidence >= 90 
                    ? "bg-green-100" 
                    : summary.confidence >= 60 
                      ? "bg-yellow-100"
                      : "bg-red-100"
                } />
              </div>
            </div>
          </div>
          
          <div className="p-4 bg-white/80 rounded-lg shadow-sm">
            <h4 className="font-medium mb-2 text-primary">Correspondência entre plataformas</h4>
            <div className="flex flex-wrap gap-2">
              {summary.matchingPlatforms.map((match) => (
                <span key={match} className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm flex items-center">
                  <CheckCircle2 className="h-3 w-3 mr-1" />
                  {match}
                </span>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
