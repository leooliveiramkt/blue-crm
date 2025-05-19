
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.1';

// Função auxiliar para criar registro de status da sincronização
export async function createSyncRecord(
  supabase: any,
  status: string,
  details?: any,
  recordsProcessed: number = 0
): Promise<string> {
  const { data, error } = await supabase
    .from('wbuy_sync_status')
    .insert({
      status,
      details,
      last_sync: new Date().toISOString(),
      total_records_processed: recordsProcessed,
    })
    .select('id')
    .single();

  if (error) {
    console.error('Erro ao criar registro de sincronização:', error);
    throw error;
  }

  return data.id;
}

// Função para atualizar o registro de sincronização
export async function updateSyncRecord(
  supabase: any,
  syncId: string,
  status: string,
  details?: any,
  recordsProcessed?: number
): Promise<void> {
  const updateData: any = {
    status,
    updated_at: new Date().toISOString(),
  };

  if (details) {
    updateData.details = details;
  }

  if (recordsProcessed !== undefined) {
    updateData.total_records_processed = recordsProcessed;
  }

  const { error } = await supabase
    .from('wbuy_sync_status')
    .update(updateData)
    .eq('id', syncId);

  if (error) {
    console.error('Erro ao atualizar registro de sincronização:', error);
    throw error;
  }
}
