import { useEffect, useState } from 'react';
import { WBuySyncScheduler } from '@/services/wbuy/wbuySyncScheduler';
import { supabase } from '@/lib/supabase';

export function useWBuySync(tenantId: string) {
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastSync, setLastSync] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const scheduler = WBuySyncScheduler.getInstance();

    // Inicia sincronização
    scheduler.startSync(tenantId);

    // Monitora status da sincronização
    const subscription = supabase
      .from('wbuy_sync_status')
      .on('*', (payload) => {
        if (payload.new.tenant_id === tenantId) {
          setIsSyncing(payload.new.status === 'syncing');
          setLastSync(payload.new.last_sync_at);
          setError(payload.new.error);
        }
      })
      .subscribe();

    return () => {
      // Limpa sincronização ao desmontar
      scheduler.stopSync(tenantId);
      subscription.unsubscribe();
    };
  }, [tenantId]);

  return {
    isSyncing,
    lastSync,
    error
  };
} 