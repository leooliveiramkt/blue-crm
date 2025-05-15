
import React from 'react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { RefreshCcw } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { SyncStatusDisplay } from '../SyncStatusDisplay';

interface HistoryTabProps {
  syncHistory: any[];
  loadSyncHistory: () => Promise<void>;
  isLoading: boolean;
}

export const HistoryTab: React.FC<HistoryTabProps> = ({
  syncHistory,
  loadSyncHistory,
  isLoading
}) => {
  // Formata data para exibição
  const formatDate = (dateString: string) => {
    if (!dateString) return '-';
    return format(new Date(dateString), 'dd/MM/yyyy HH:mm:ss', { locale: ptBR });
  };

  return (
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
                    <TableCell>
                      <SyncStatusDisplay status={sync.status} />
                    </TableCell>
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
  );
};
