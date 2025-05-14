
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { CalendarIcon, Check, CheckCircle, Clock, Download, RefreshCcw, X } from 'lucide-react';
import { wbuySyncService } from '@/services/wbuy-sync-service';
import { useToast } from '@/components/ui/use-toast';

const formatDate = (dateString: string) => {
  if (!dateString) return '-';
  return format(new Date(dateString), 'dd/MM/yyyy HH:mm:ss', { locale: ptBR });
};

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(value);
};

const WbuySync = () => {
  const [activeTab, setActiveTab] = useState('sync');
  const [syncHistory, setSyncHistory] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [syncInProgress, setSyncInProgress] = useState(false);
  const [fullSync, setFullSync] = useState(false);
  const [dateRange, setDateRange] = useState<{
    startDate: Date | undefined;
    endDate: Date | undefined;
  }>({
    startDate: undefined,
    endDate: undefined,
  });
  const [lastSync, setLastSync] = useState<any>(null);
  const [latestStats, setLatestStats] = useState<{
    year: any;
    month: any;
  }>({ year: null, month: null });
  const [yearlyStats, setYearlyStats] = useState<any[]>([]);
  const [monthlyStats, setMonthlyStats] = useState<any[]>([]);
  const { toast } = useToast();

  // Carrega dados iniciais
  useEffect(() => {
    loadSyncHistory();
    loadLastSync();
    loadLatestStats();
    loadAllStats();
  }, []);

  // Carrega histórico de sincronizações
  const loadSyncHistory = async () => {
    setIsLoading(true);
    try {
      const history = await wbuySyncService.getSyncHistory(20);
      setSyncHistory(history);
    } catch (error) {
      console.error('Erro ao carregar histórico de sincronizações:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Carrega informações da última sincronização
  const loadLastSync = async () => {
    try {
      const data = await wbuySyncService.getLastSync();
      setLastSync(data);
      
      // Verifica se há uma sincronização em andamento
      if (data && ['em_andamento', 'processando'].includes(data.status)) {
        setSyncInProgress(true);
        
        // Configura um timer para verificar atualizações
        const timer = setTimeout(() => {
          loadLastSync();
        }, 5000); // Verifica a cada 5 segundos
        
        return () => clearTimeout(timer);
      } else {
        setSyncInProgress(false);
      }
    } catch (error) {
      console.error('Erro ao carregar última sincronização:', error);
    }
  };

  // Carrega estatísticas mais recentes
  const loadLatestStats = async () => {
    try {
      const stats = await wbuySyncService.getLatestStats();
      setLatestStats(stats);
    } catch (error) {
      console.error('Erro ao carregar estatísticas recentes:', error);
    }
  };

  // Carrega todas as estatísticas
  const loadAllStats = async () => {
    try {
      const yearStats = await wbuySyncService.getStatsByPeriod('year');
      const monthStats = await wbuySyncService.getStatsByPeriod('month');
      
      setYearlyStats(yearStats);
      setMonthlyStats(monthStats);
    } catch (error) {
      console.error('Erro ao carregar estatísticas:', error);
    }
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
    
    setIsLoading(true);
    
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
    } finally {
      setIsLoading(false);
    }
  };

  // Atualiza os dados quando uma sincronização é concluída
  useEffect(() => {
    if (!syncInProgress) {
      loadLatestStats();
      loadAllStats();
    }
  }, [syncInProgress]);

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
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Sincronização Wbuy</h1>
      
      <Tabs defaultValue="sync" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-6">
          <TabsTrigger value="sync">Sincronização</TabsTrigger>
          <TabsTrigger value="stats">Estatísticas</TabsTrigger>
          <TabsTrigger value="history">Histórico</TabsTrigger>
        </TabsList>

        {/* Tab de Sincronização */}
        <TabsContent value="sync">
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
        </TabsContent>

        {/* Tab de Estatísticas */}
        <TabsContent value="stats">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Estatísticas Anuais</CardTitle>
                <CardDescription>
                  Resumo de vendas por ano
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {yearlyStats.length > 0 ? (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Ano</TableHead>
                          <TableHead>Pedidos</TableHead>
                          <TableHead>Receita</TableHead>
                          <TableHead>Afiliados</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {yearlyStats.map((stat) => (
                          <TableRow key={stat.id}>
                            <TableCell className="font-medium">{stat.period_value}</TableCell>
                            <TableCell>{stat.total_orders}</TableCell>
                            <TableCell>{formatCurrency(stat.total_revenue)}</TableCell>
                            <TableCell>{stat.total_affiliates || 0}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  ) : (
                    <div className="text-center py-4 text-muted-foreground">
                      Nenhuma estatística anual disponível
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Estatísticas Mensais</CardTitle>
                <CardDescription>
                  Resumo de vendas por mês
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {monthlyStats.length > 0 ? (
                    <div className="max-h-96 overflow-y-auto">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Período</TableHead>
                            <TableHead>Pedidos</TableHead>
                            <TableHead>Receita</TableHead>
                            <TableHead>Afiliados</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {monthlyStats.map((stat) => (
                            <TableRow key={stat.id}>
                              <TableCell className="font-medium">{stat.period_value}</TableCell>
                              <TableCell>{stat.total_orders}</TableCell>
                              <TableCell>{formatCurrency(stat.total_revenue)}</TableCell>
                              <TableCell>{stat.total_affiliates || 0}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  ) : (
                    <div className="text-center py-4 text-muted-foreground">
                      Nenhuma estatística mensal disponível
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Detalhes de Distribuição</CardTitle>
                <CardDescription>
                  Informações detalhadas sobre produtos, métodos de pagamento e afiliados
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Accordion type="single" collapsible className="w-full">
                  {latestStats.year && (
                    <AccordionItem value="products">
                      <AccordionTrigger>Distribuição de Produtos</AccordionTrigger>
                      <AccordionContent>
                        <div className="space-y-2">
                          {latestStats.year.product_distribution && (
                            <Table>
                              <TableHeader>
                                <TableRow>
                                  <TableHead>Produto</TableHead>
                                  <TableHead>Quantidade</TableHead>
                                </TableRow>
                              </TableHeader>
                              <TableBody>
                                {Object.entries(latestStats.year.product_distribution).map(([product, count]: [string, any]) => (
                                  <TableRow key={product}>
                                    <TableCell className="font-medium">{product}</TableCell>
                                    <TableCell>{count}</TableCell>
                                  </TableRow>
                                ))}
                              </TableBody>
                            </Table>
                          )}
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  )}
                  
                  {latestStats.year && (
                    <AccordionItem value="payments">
                      <AccordionTrigger>Métodos de Pagamento</AccordionTrigger>
                      <AccordionContent>
                        <div className="space-y-2">
                          {latestStats.year.payment_methods_distribution && (
                            <Table>
                              <TableHeader>
                                <TableRow>
                                  <TableHead>Método</TableHead>
                                  <TableHead>Quantidade</TableHead>
                                </TableRow>
                              </TableHeader>
                              <TableBody>
                                {Object.entries(latestStats.year.payment_methods_distribution).map(([method, count]: [string, any]) => (
                                  <TableRow key={method}>
                                    <TableCell className="font-medium">{method}</TableCell>
                                    <TableCell>{count}</TableCell>
                                  </TableRow>
                                ))}
                              </TableBody>
                            </Table>
                          )}
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  )}
                  
                  {latestStats.year && (
                    <AccordionItem value="affiliates">
                      <AccordionTrigger>Distribuição por Afiliados</AccordionTrigger>
                      <AccordionContent>
                        <div className="space-y-2">
                          {latestStats.year.affiliate_distribution && (
                            <Table>
                              <TableHeader>
                                <TableRow>
                                  <TableHead>Afiliado</TableHead>
                                  <TableHead>Quantidade</TableHead>
                                </TableRow>
                              </TableHeader>
                              <TableBody>
                                {Object.entries(latestStats.year.affiliate_distribution).map(([affiliate, count]: [string, any]) => (
                                  <TableRow key={affiliate}>
                                    <TableCell className="font-medium">{affiliate}</TableCell>
                                    <TableCell>{count}</TableCell>
                                  </TableRow>
                                ))}
                              </TableBody>
                            </Table>
                          )}
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  )}
                </Accordion>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Tab de Histórico */}
        <TabsContent value="history">
          <Card>
            <CardHeader>
              <CardTitle>Histórico de Sincronização</CardTitle>
              <CardDescription>
                Registros das últimas sincronizações realizadas
              </CardDescription>
            </CardHeader>
            <CardContent>
              {syncHistory.length > 0 ? (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Data</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Pedidos Processados</TableHead>
                        <TableHead>Detalhes</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {syncHistory.map((sync) => (
                        <TableRow key={sync.id}>
                          <TableCell>{formatDate(sync.last_sync)}</TableCell>
                          <TableCell>{renderSyncStatus(sync.status)}</TableCell>
                          <TableCell>{sync.total_records_processed || 0}</TableCell>
                          <TableCell>
                            {sync.details && (
                              <Accordion type="single" collapsible className="w-full">
                                <AccordionItem value="details">
                                  <AccordionTrigger>Ver detalhes</AccordionTrigger>
                                  <AccordionContent>
                                    <div className="space-y-2 text-sm">
                                      {sync.details.summary && (
                                        <p><span className="font-medium">Resumo:</span> {sync.details.summary}</p>
                                      )}
                                      
                                      {sync.details.start_date && sync.details.end_date && (
                                        <p>
                                          <span className="font-medium">Período:</span> {format(new Date(sync.details.start_date), 'dd/MM/yyyy')} até {format(new Date(sync.details.end_date), 'dd/MM/yyyy')}
                                        </p>
                                      )}
                                      
                                      {sync.details.error && (
                                        <p className="text-red-500">
                                          <span className="font-medium">Erro:</span> {sync.details.error}
                                        </p>
                                      )}
                                      
                                      {sync.details.errors && sync.details.errors.length > 0 && (
                                        <div>
                                          <p className="font-medium text-red-500">Erros encontrados:</p>
                                          <ul className="list-disc pl-4 text-red-500">
                                            {sync.details.errors.map((err: any, index: number) => (
                                              <li key={index}>
                                                Lote {err.batch}: {err.error}
                                              </li>
                                            ))}
                                          </ul>
                                        </div>
                                      )}
                                    </div>
                                  </AccordionContent>
                                </AccordionItem>
                              </Accordion>
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  Nenhum registro de sincronização encontrado
                </div>
              )}
            </CardContent>
            <CardFooter>
              <Button variant="outline" onClick={loadSyncHistory} disabled={isLoading}>
                <RefreshCcw className="mr-2 h-4 w-4" />
                Atualizar Histórico
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default WbuySync;
