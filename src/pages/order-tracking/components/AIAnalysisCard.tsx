
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Loader2 } from 'lucide-react';
import { BrainIcon } from './icons/CustomIcons';

interface AIAnalysisCardProps {
  isAnalyzing: boolean;
  aiAnalysis?: {
    conclusion: string;
    attribution: string;
    confidence: string;
    recommendedAction: string;
  };
  analyzeWithAI: () => void;
}

export const AIAnalysisCard: React.FC<AIAnalysisCardProps> = ({
  isAnalyzing,
  aiAnalysis,
  analyzeWithAI,
}) => {
  return (
    <Card className="bg-gradient-to-r from-purple-50 to-blue-50 border-primary/30 overflow-hidden">
      <div className="h-2 bg-gradient-to-r from-purple-600 to-blue-600"></div>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center">
            <div className="mr-2 p-1.5 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full text-white">
              <BrainIcon className="h-4 w-4" />
            </div>
            Análise Inteligente
          </CardTitle>
          {isAnalyzing ? (
            <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
              <Loader2 className="mr-1 h-3 w-3 animate-spin" />
              Analisando
            </Badge>
          ) : aiAnalysis ? (
            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
              Análise concluída
            </Badge>
          ) : (
            <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
              Aguardando análise
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="pt-2">
        {isAnalyzing ? (
          <div className="py-8 flex flex-col items-center justify-center">
            <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
            <p className="text-center text-sm text-muted-foreground">
              Processando dados e realizando análise inteligente...
            </p>
            <Progress className="w-full max-w-xs mt-4" value={65} />
          </div>
        ) : aiAnalysis ? (
          <div className="space-y-4">
            <div className="p-4 bg-white rounded-lg border border-primary/10 shadow-sm">
              <div className="font-medium text-lg mb-2 text-primary">Conclusão</div>
              <p>{aiAnalysis.conclusion}</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-3 bg-white rounded-lg border border-primary/10 shadow-sm">
                <div className="font-medium mb-1 text-sm text-muted-foreground">Atribuição de Venda</div>
                <p className="font-semibold">{aiAnalysis.attribution}</p>
              </div>
              
              <div className="p-3 bg-white rounded-lg border border-primary/10 shadow-sm">
                <div className="font-medium mb-1 text-sm text-muted-foreground">Nível de Confiança</div>
                <div className="flex items-center">
                  <Badge className={
                    aiAnalysis.confidence === "Alta" 
                      ? "bg-green-100 text-green-800 border-green-200" 
                      : aiAnalysis.confidence === "Média" 
                        ? "bg-yellow-100 text-yellow-800 border-yellow-200"
                        : "bg-red-100 text-red-800 border-red-200"
                  }>
                    {aiAnalysis.confidence}
                  </Badge>
                </div>
              </div>
              
              <div className="p-3 bg-white rounded-lg border border-primary/10 shadow-sm">
                <div className="font-medium mb-1 text-sm text-muted-foreground">Ação Recomendada</div>
                <p className="text-sm">{aiAnalysis.recommendedAction}</p>
              </div>
            </div>
          </div>
        ) : (
          <div className="py-6 text-center">
            <Button onClick={analyzeWithAI} disabled={isAnalyzing}>
              <BrainIcon className="mr-2 h-4 w-4" />
              Iniciar Análise da IA
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
