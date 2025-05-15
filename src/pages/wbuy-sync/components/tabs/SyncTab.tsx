
import React, { useState } from 'react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { CalendarIcon, Clock, CheckCircle, Check, X, RefreshCcw, Download } from 'lucide-react';
import { wbuySyncService } from '@/services/wbuy/sync';
import { useToast } from '@/hooks/use-toast';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { cn } from '@/lib/utils';
import { AlertDialog, AlertDialogTrigger, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogAction, AlertDialogCancel } from '@/components/ui/alert-dialog';

interface SyncTabProps {
  isLoading: boolean;
  syncInProgress: boolean;
  lastSync: any;
  loadLastSync: () => Promise<void>;
  loadSyncHistory: () => Promise<void>;
  setSyncInProgress: (inProgress: boolean) => void;
}

export const SyncTab: React.FC<SyncTabProps> = ({
  isLoading,
  syncInProgress,
  lastSync,
  loadLastSync,
  loadSyncHistory,
  setSyncInProgress
}) => {
  const [fullSync, setFullSync] = useState(false);
  const [dateRange, setDateRange] = useState<{
    startDate: Date | undefined;
    endDate: Date | undefined;
  }>({
    startDate: undefined,
    endDate: undefined,
  });
  
  const { toast } = useToast();

  // Formata data para exibição
  const formatDate = (dateString: string) => {
    if (!dateString) return '-';
    return format(new Date(dateString), 'dd/MM/yyyy HH:mm:ss', { locale: ptBR });
  };

  // Inicia o processo de sincronização
  const startSync = async () => {
    if (syncInProgress) {
      toast({
        title: "Sincronização em andamento",
        description: "Aguarde o término da sincronização atual antes de iniciar uma nova.",
        variant: "warning"
      });
      return;
    }
    
    try {
      const startDate = dateRange.startDate ? format(dateRange.startDate, 'yyyy-MM-dd') : undefined;
      const endDate = dateRange.endDate ? format(dateRange.endDate, 'yyyy-MM-dd') : undefined;
      
      const result = await wbuySyncService.startSync(fullSync, startDate, endDate);
      
      if (result.success) {
        setSyncInProgress(true);
        
        // Recarrega dados após um breve intervalo
        setTimeout(() => {
          loadSyncHistory();
          loadLastSync();
        }, 2000);
      }
    } catch (error) {
      console.error('Erro ao iniciar sincronização:', error);
    }
  };

  // Renderiza status da sincronização com ícone
  const renderSyncStatus = (status: string) => {
    switch (status) {
      case 'concluido':
        return (
          <div className="flex items-center text-green-500">
            <CheckCircle className="h-4 w-4 mr-1" />
            <span>Concluído</span>
          </div>
        );
      case 'concluido_com_erros':
        return (
          <div className="flex items-center text-amber-500">
            <Check className="h-4 w-4 mr-1" />
            <span>Concluído com erros</span>
          </div>
        );
      case 'erro':
        return (
          <div className="flex items-center text-red-500">
            <X className="h-4 w-4 mr-1" />
            <span>Erro</span>
          </div>
        );
      case 'em_andamento':
      case 'processando':
        return (
          <div className="flex items-center text-blue-500">
            <Clock className="h-4 w-4 mr-1 animate-spin" />
            <span>{status === 'em_andamento' ? 'Em andamento' : 'Processando'}</span>
          </div>
        );
      default:
        return (
          <div className="flex items-center">
            <span>{status}</span>
          </div>
        );
    }
  };

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Sincronização de Dados</CardTitle>
          <CardDescription>
            Sincronize dados de pedidos da Wbuy para o banco de dados local
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Switch 
                id="full-sync" 
                checked={fullSync} 
                onCheckedChange={setFullSync}
              />
              <Label htmlFor="full-sync">Sincronização completa (todos os pedidos)</Label>
            </div>

            {!fullSync && (
              <div className="space-y-2">
                <div className="grid gap-2">
                  <Label htmlFor="start-date">Data inicial</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        id="start-date"
                        variant="outline"
                        className={cn(
                          "justify-start text-left font-normal w-full",
                          !dateRange.startDate && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {dateRange.startDate ? (
                          format(dateRange.startDate, "dd/MM/yyyy", { locale: ptBR })
                        ) : (
                          <span>Selecione a data</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={dateRange.startDate}
                        onSelect={(date) => setDateRange(prev => ({ ...prev, startDate: date }))}
                        initialFocus
                        className={cn("p-3 pointer-events-auto")}
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="end-date">Data final</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        id="end-date"
                        variant="outline"
                        className={cn(
                          "justify-start text-left font-normal w-full",
                          !dateRange.endDate && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {dateRange.endDate ? (
                          format(dateRange.endDate, "dd/MM/yyyy", { locale: ptBR })
                        ) : (
                          <span>Selecione a data</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={dateRange.endDate}
                        onSelect={(date) => setDateRange(prev => ({ ...prev, endDate: date }))}
                        initialFocus
                        className={cn("p-3 pointer-events-auto")}
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
            )}
          </div>
        </CardContent>
        <CardFooter>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button disabled={isLoading || syncInProgress}>
                {syncInProgress ? (
                  <>
                    <RefreshCcw className="mr-2 h-4 w-4 animate-spin" />
                    Sincronizando...
                  </>
                ) : (
                  <>
                    <Download className="mr-2 h-4 w-4" />
                    Iniciar Sincronização
                  </>
                )}
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Confirmar sincronização</AlertDialogTitle>
                <AlertDialogDescription>
                  {fullSync
                    ? "Você está prestes a iniciar uma sincronização completa de dados. Este processo pode levar alguns minutos."
                    : "Você está prestes a sincronizar dados dentro do período selecionado."}
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                <AlertDialogAction onClick={startSync}>Continuar</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </CardFooter>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Status da Sincronização</CardTitle>
          <CardDescription>
            Informações sobre a última sincronização
          </CardDescription>
        </CardHeader>
        <CardContent>
          {lastSync ? (
            <div className="space-y-4">
              <div>
                <h3 className="font-medium">Status</h3>
                <div className="mt-1">{renderSyncStatus(lastSync.status)}</div>
              </div>
              
              <div>
                <h3 className="font-medium">Data da sincronização</h3>
                <div className="mt-1">{formatDate(lastSync.last_sync)}</div>
              </div>
              
              {lastSync.total_records_processed !== null && (
                <div>
                  <h3 className="font-medium">Pedidos processados</h3>
                  <div className="mt-1">{lastSync.total_records_processed || 0}</div>
                </div>
              )}
              
              {lastSync.details && lastSync.details.summary && (
                <div>
                  <h3 className="font-medium">Resumo</h3>
                  <div className="mt-1">{lastSync.details.summary}</div>
                </div>
              )}
              
              {lastSync.details && lastSync.details.errors && lastSync.details.errors.length > 0 && (
                <div>
                  <h3 className="font-medium text-red-500">Erros</h3>
                  <div className="mt-1 text-red-500">{lastSync.details.errors.length} erros encontrados</div>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-4 text-muted-foreground">
              Nenhuma sincronização realizada
            </div>
          )}
        </CardContent>
        <CardFooter>
          <Button variant="outline" onClick={loadLastSync}>
            <RefreshCcw className="mr-2 h-4 w-4" />
            Atualizar Status
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};
