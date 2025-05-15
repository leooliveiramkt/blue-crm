
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.1";

// URL e chaves do projeto Supabase
const supabaseUrl = 'https://zkjpzwrcuauieaaktzbk.supabase.co';
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';

// Headers CORS para permitir requisições de qualquer origem
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Tratar preflight requests para CORS
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    // Inicializa o cliente Supabase com a service role key
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    
    // Obter todas as integrações
    const { data: integrations, error: integrationsError } = await supabase
      .from('integrations')
      .select('*');
    
    if (integrationsError) {
      throw integrationsError;
    }

    console.log(`Executando sincronização automática para ${integrations?.length || 0} integrações`);
    
    // Processar cada integração e atualizar status
    for (const integration of integrations || []) {
      try {
        // Aqui você pode implementar a lógica de sincronização específica para cada tipo de integração
        console.log(`Sincronizando integração: ${integration.id}`);
        
        // No caso da integração Wbuy, podemos iniciar a sincronização através da função wbuy-sync
        if (integration.id === 'wbuy' && integration.status === 'connected') {
          const syncUrl = `${supabaseUrl}/functions/v1/wbuy-sync`;
          const response = await fetch(syncUrl, {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${supabaseServiceKey}`,
              'Content-Type': 'application/json'
            }
          });
          
          if (!response.ok) {
            console.error(`Erro ao sincronizar Wbuy: ${response.status} ${response.statusText}`);
          } else {
            console.log(`Sincronização Wbuy iniciada com sucesso`);
          }
        }
        
        // Atualiza o timestamp de última sincronização
        const { error: updateError } = await supabase
          .from('integrations')
          .update({ 
            last_sync: new Date().toISOString(),
            metadata: {
              ...integration.metadata,
              last_sync_status: 'success'
            }
          })
          .eq('id', integration.id)
          .eq('tenant_id', integration.tenant_id);
        
        if (updateError) {
          console.error(`Erro ao atualizar status da integração ${integration.id}:`, updateError);
        }
      } catch (error) {
        console.error(`Erro ao processar integração ${integration.id}:`, error);
        
        // Registra o erro na tabela de integrações
        await supabase
          .from('integrations')
          .update({ 
            metadata: {
              ...integration.metadata,
              last_sync_status: 'error',
              last_error: error instanceof Error ? error.message : 'Erro desconhecido'
            }
          })
          .eq('id', integration.id)
          .eq('tenant_id', integration.tenant_id);
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Sincronização automática executada com sucesso',
        processed: integrations?.length || 0
      }),
      {
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      }
    );
  } catch (error) {
    console.error('Erro na sincronização automática:', error);
    
    return new Response(
      JSON.stringify({
        success: false,
        error: error instanceof Error ? error.message : 'Erro desconhecido',
      }),
      {
        status: 500,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      }
    );
  }
});
