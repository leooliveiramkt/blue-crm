
import React, { useState, useEffect } from 'react';
import { wbuySyncService } from '@/services/wbuy/sync';
import { SyncTabs } from './components/SyncTabs';

const WbuySyncPage = () => {
  const [activeTab, setActiveTab] = useState('sync');
  const [syncHistory, setSyncHistory] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [syncInProgress, setSyncInProgress] = useState(false);
  const [lastSync, setLastSync] = useState<any>(null);
  const [latestStats, setLatestStats] = useState<{
    year: any;
    month: any;
  }>({ year: null, month: null });
  const [yearlyStats, setYearlyStats] = useState<any[]>([]);
  const [monthlyStats, setMonthlyStats] = useState<any[]>([]);

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

  // Atualiza os dados quando uma sincronização é concluída
  useEffect(() => {
    if (!syncInProgress) {
      loadLatestStats();
      loadAllStats();
    }
  }, [syncInProgress]);

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Sincronização Wbuy</h1>
      
      <SyncTabs 
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isLoading={isLoading}
        syncInProgress={syncInProgress}
        syncHistory={syncHistory}
        lastSync={lastSync}
        latestStats={latestStats}
        yearlyStats={yearlyStats}
        monthlyStats={monthlyStats}
        loadSyncHistory={loadSyncHistory}
        loadLastSync={loadLastSync}
        setSyncInProgress={setSyncInProgress}
      />
    </div>
  );
};

export default WbuySyncPage;
