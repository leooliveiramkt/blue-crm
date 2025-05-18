
import React from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { SyncTab } from './tabs/SyncTab';
import { StatsTab } from './tabs/StatsTab';
import { HistoryTab } from './tabs/HistoryTab';

interface SyncTabsProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isLoading: boolean;
  syncInProgress: boolean;
  syncHistory: any[];
  lastSync: any;
  latestStats: {
    year: any;
    month: any;
  };
  yearlyStats: any[];
  monthlyStats: any[];
  loadSyncHistory: () => Promise<void>;
  loadLastSync: () => Promise<void>;
  setSyncInProgress: (inProgress: boolean) => void;
}

export const SyncTabs: React.FC<SyncTabsProps> = ({
  activeTab,
  setActiveTab,
  isLoading,
  syncInProgress,
  syncHistory,
  lastSync,
  latestStats,
  yearlyStats,
  monthlyStats,
  loadSyncHistory,
  loadLastSync,
  setSyncInProgress
}) => {
  return (
    <Tabs defaultValue="sync" value={activeTab} onValueChange={setActiveTab}>
      <TabsList className="mb-6">
        <TabsTrigger value="sync">Sincronização</TabsTrigger>
        <TabsTrigger value="stats">Estatísticas</TabsTrigger>
        <TabsTrigger value="history">Histórico</TabsTrigger>
      </TabsList>

      {/* Tab de Sincronização */}
      <TabsContent value="sync">
        <SyncTab 
          isLoading={isLoading}
          syncInProgress={syncInProgress}
          lastSync={lastSync}
          loadLastSync={loadLastSync}
          loadSyncHistory={loadSyncHistory}
          setSyncInProgress={setSyncInProgress}
        />
      </TabsContent>

      {/* Tab de Estatísticas */}
      <TabsContent value="stats">
        <StatsTab 
          yearlyStats={yearlyStats}
          monthlyStats={monthlyStats}
          latestStats={latestStats}
        />
      </TabsContent>

      {/* Tab de Histórico */}
      <TabsContent value="history">
        <HistoryTab 
          syncHistory={syncHistory}
          loadSyncHistory={loadSyncHistory}
          isLoading={isLoading}
        />
      </TabsContent>
    </Tabs>
  );
};
