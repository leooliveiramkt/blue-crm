// 🎛️ PAINEL DE CONTROLE DA SINCRONIZAÇÃO AUTOMÁTICA

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { globalAutoSync } from '@/services/sync/AutoSyncService';
import { runPreload } from '@/scripts/preload-data';

interface SyncStatus {
  isRunning: boolean;
  intervalMinutes: number;
  tenantsCount: number;
  nextRun: Date | null;
}

interface SyncStats {
  [tenantId: string]: {
    [dataType: string]: number;
  };
}

export const SyncControlPanel: React.FC = () => {
  const [syncStatus, setSyncStatus] = useState<SyncStatus>({
    isRunning: false,
    intervalMinutes: 1,
    tenantsCount: 0,
    nextRun: null
  });
  
  const [syncStats, setSyncStats] = useState<SyncStats>({});
  const [isPreloading, setIsPreloading] = useState(false);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);

  // 🔄 ATUALIZAR STATUS
  const updateStatus = () => {
    const status = globalAutoSync.getStatus();
    setSyncStatus(status);
    setLastUpdate(new Date());
  };

  // 📊 CARREGAR ESTATÍSTICAS
  const loadStats = async () => {
    try {
      const stats = await globalAutoSync.getSyncStatistics();
      setSyncStats(stats);
    } catch (error) {
      console.error('❌ Erro ao carregar estatísticas:', error);
    }
  };

  // 🚀 INICIAR SINCRONIZAÇÃO
  const startSync = () => {
    globalAutoSync.start();
    updateStatus();
  };

  // ⏹️ PARAR SINCRONIZAÇÃO
  const stopSync = () => {
    globalAutoSync.stop();
    updateStatus();
  };

  // 🔄 EXECUTAR PRÉ-CARGA
  const executePreload = async () => {
    setIsPreloading(true);
    try {
      await runPreload();
      await loadStats();
      alert('✅ Pré-carga completa finalizada com sucesso!');
    } catch (error) {
      console.error('❌ Erro na pré-carga:', error);
      alert('❌ Erro na pré-carga. Verifique o console para detalhes.');
    } finally {
      setIsPreloading(false);
    }
  };

  // 🔄 ATUALIZAR A CADA 5 SEGUNDOS
  useEffect(() => {
    updateStatus();
    loadStats();

    const interval = setInterval(() => {
      updateStatus();
      loadStats();
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-6">
      {/* STATUS DA SINCRONIZAÇÃO */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            🔄 Status da Sincronização Automática
            <Badge 
              variant={syncStatus.isRunning ? "default" : "secondary"}
              className={syncStatus.isRunning ? "bg-green-500" : "bg-gray-500"}
            >
              {syncStatus.isRunning ? "ATIVA" : "PARADA"}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-blue-600">
                {syncStatus.intervalMinutes}min
              </p>
              <p className="text-sm text-gray-600">Intervalo</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-green-600">
                {syncStatus.tenantsCount}
              </p>
              <p className="text-sm text-gray-600">Tenants</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-purple-600">
                {syncStatus.nextRun ? syncStatus.nextRun.toLocaleTimeString() : '--:--'}
              </p>
              <p className="text-sm text-gray-600">Próxima Execução</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-orange-600">
                {lastUpdate ? lastUpdate.toLocaleTimeString() : '--:--'}
              </p>
              <p className="text-sm text-gray-600">Última Atualização</p>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <Button 
              onClick={startSync}
              disabled={syncStatus.isRunning}
              className="bg-green-600 hover:bg-green-700"
            >
              🚀 Iniciar Sincronização
            </Button>
            
            <Button 
              onClick={stopSync}
              disabled={!syncStatus.isRunning}
              variant="destructive"
            >
              ⏹️ Parar Sincronização
            </Button>
            
            <Button 
              onClick={executePreload}
              disabled={isPreloading}
              variant="outline"
              className="border-blue-500 text-blue-600 hover:bg-blue-50"
            >
              {isPreloading ? '⏳ Carregando...' : '🔄 Executar Pré-carga'}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* ESTATÍSTICAS POR TENANT */}
      <Card>
        <CardHeader>
          <CardTitle>📊 Estatísticas de Dados</CardTitle>
        </CardHeader>
        <CardContent>
          {Object.keys(syncStats).length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <p>📥 Nenhum dado sincronizado ainda</p>
              <p className="text-sm">Execute a pré-carga para começar</p>
            </div>
          ) : (
            <div className="space-y-4">
              {Object.entries(syncStats).map(([tenantId, stats]) => (
                <div key={tenantId} className="border rounded-lg p-4">
                  <h3 className="font-semibold text-lg mb-3 capitalize">
                    🏢 {tenantId.replace('_', ' ')}
                  </h3>
                  
                  {typeof stats === 'object' && !stats.error ? (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                      {Object.entries(stats).map(([dataType, count]) => (
                        <div key={dataType} className="bg-gray-50 p-3 rounded text-center">
                          <p className="text-xl font-bold text-blue-600">{count}</p>
                          <p className="text-sm text-gray-600 capitalize">
                            {dataType.replace('_', ' ')}
                          </p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-red-500 text-center py-4">
                      ❌ {stats.error || 'Erro ao carregar dados'}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* LOGS DE SINCRONIZAÇÃO */}
      <Card>
        <CardHeader>
          <CardTitle>📝 Instruções de Uso</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 text-sm">
            <div className="flex items-start gap-2">
              <span className="font-bold text-blue-600">1.</span>
              <p><strong>Pré-carga Inicial:</strong> Execute primeiro a pré-carga completa para baixar todos os dados das APIs WBuy e Active Campaign para o Supabase.</p>
            </div>
            
            <div className="flex items-start gap-2">
              <span className="font-bold text-green-600">2.</span>
              <p><strong>Sincronização Automática:</strong> Após a pré-carga, inicie a sincronização automática que rodará a cada minuto para manter os dados atualizados.</p>
            </div>
            
            <div className="flex items-start gap-2">
              <span className="font-bold text-purple-600">3.</span>
              <p><strong>Monitoramento:</strong> Acompanhe as estatísticas e status em tempo real. O sistema não travará pois os dados já estarão no Supabase.</p>
            </div>
            
            <div className="bg-yellow-50 border border-yellow-200 p-3 rounded mt-4">
              <p className="text-yellow-800">
                ⚠️ <strong>Importante:</strong> Execute a pré-carga antes de disponibilizar o sistema para os usuários. 
                Isso garante que todos os dados estejam disponíveis localmente no Supabase.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SyncControlPanel; 