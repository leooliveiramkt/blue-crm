
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';
import { SyncStatus, SyncStatusType } from './types';

/**
 * Hook para obter informações sobre o status da sincronização automática
 */
export const useSyncStatus = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [latestSync, setLatestSync] = useState<SyncStatus | null>(null);
  const [syncHistory, setSyncHistory] = useState<SyncStatus[]>([]);
  const { toast } = useToast();

  /**
   * Carrega o status da sincronização mais recente
   */
  const loadLatestSync = async () => {
    setIsLoading(true);
    
    try {
      const { data, error } = await supabase
        .from('wbuy_sync_status')
        .select('*')
        .order('last_sync', { ascending: false })
        .limit(1)
        .single();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      // Convertendo o status para o tipo correto
      if (data) {
        const syncStatus: SyncStatus = {
          id: data.id,
          status: data.status as SyncStatusType,
          last_sync: data.last_sync,
          total_records_processed: data.total_records_processed,
          details: data.details
        };
        setLatestSync(syncStatus);
      } else {
        setLatestSync(null);
      }
    } catch (error) {
      console.error('Erro ao carregar última sincronização:', error);
      toast({
        title: "Erro ao carregar dados",
        description: "Não foi possível obter informações da última sincronização",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Carrega o histórico de sincronizações
   * @param limit Limite de registros (padrão: 10)
   */
  const loadSyncHistory = async (limit: number = 10) => {
    setIsLoading(true);
    
    try {
      const { data, error } = await supabase
        .from('wbuy_sync_status')
        .select('*')
        .order('last_sync', { ascending: false })
        .limit(limit);

      if (error) {
        throw error;
      }

      // Convertendo o status para o tipo correto para cada item
      if (data) {
        const syncItems: SyncStatus[] = data.map(item => ({
          id: item.id,
          status: item.status as SyncStatusType,
          last_sync: item.last_sync,
          total_records_processed: item.total_records_processed,
          details: item.details
        }));
        setSyncHistory(syncItems);
      } else {
        setSyncHistory([]);
      }
    } catch (error) {
      console.error('Erro ao carregar histórico de sincronização:', error);
      toast({
        title: "Erro ao carregar dados",
        description: "Não foi possível obter o histórico de sincronização",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Carrega dados iniciais ao montar o componente
  useEffect(() => {
    loadLatestSync();
  }, []);

  return {
    isLoading,
    latestSync,
    syncHistory,
    loadLatestSync,
    loadSyncHistory
  };
};
