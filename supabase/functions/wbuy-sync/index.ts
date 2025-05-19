
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.1';
import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';

// Importa os módulos refatorados
import { corsHeaders, formatDate } from './utils.ts';
import { createSyncRecord, updateSyncRecord } from './sync-status.ts';
import { fetchWbuyOrders, processAndSaveOrders } from './orders.ts';
import { generateStats } from './stats.ts';

// URL e chaves do projeto Supabase
const supabaseUrl = 'https://zkjpzwrcuauieaaktzbk.supabase.co';
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';

serve(async (req) => {
  // Tratar preflight requests para CORS
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    // Inicializa o cliente Supabase com a service role key
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    
    // Parâmetros da requisição
    const url = new URL(req.url);
    const startDateParam = url.searchParams.get('startDate');
    const endDateParam = url.searchParams.get('endDate');
    const fullSync = url.searchParams.get('fullSync') === 'true';

    // Validação das datas
    let startDate: string;
    let endDate: string;

    if (startDateParam && endDateParam) {
      startDate = startDateParam;
      endDate = endDateParam;
    } else if (fullSync) {
      // Para sincronização completa, definimos um período amplo
      const oldestDate = new Date(2020, 0, 1); // 1º de janeiro de 2020
      startDate = formatDate(oldestDate);
      endDate = formatDate(new Date()); // Data atual
    } else {
      // Por padrão, sincroniza os últimos 30 dias
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      startDate = formatDate(thirtyDaysAgo);
      endDate = formatDate(new Date());
    }

    console.log(`Iniciando sincronização de dados da Wbuy de ${startDate} até ${endDate}`);

    // Cria registro de sincronização
    const syncId = await createSyncRecord(supabase, 'em_andamento', {
      start_date: startDate,
      end_date: endDate,
      full_sync: fullSync,
    });

    try {
      // Busca os pedidos da Wbuy
      const orders = await fetchWbuyOrders(startDate, endDate);
      
      // Atualiza o registro de sincronização
      await updateSyncRecord(
        supabase,
        syncId,
        'processando',
        { total_orders: orders.length }
      );

      // Processa e salva os pedidos
      const { savedCount, errors } = await processAndSaveOrders(supabase, orders);

      // Gera estatísticas
      await generateStats(supabase);

      // Atualiza o registro com o status final
      await updateSyncRecord(
        supabase,
        syncId,
        errors.length > 0 ? 'concluido_com_erros' : 'concluido',
        {
          total_orders: orders.length,
          errors: errors.length > 0 ? errors : null,
          summary: `${savedCount} pedidos processados com sucesso, ${errors.length} erros`
        },
        savedCount
      );

      return new Response(
        JSON.stringify({
          success: true,
          syncId,
          summary: `Sincronização concluída: ${savedCount} de ${orders.length} pedidos processados`,
          startDate,
          endDate,
          errors: errors.length > 0 ? errors : null,
        }),
        {
          headers: {
            ...corsHeaders,
            'Content-Type': 'application/json',
          },
        }
      );
    } catch (error) {
      // Em caso de erro, atualiza o registro de sincronização
      await updateSyncRecord(
        supabase,
        syncId,
        'erro',
        {
          error: error instanceof Error ? error.message : 'Erro desconhecido',
          stack: error instanceof Error ? error.stack : null,
        }
      );

      throw error;
    }
  } catch (error) {
    console.error('Erro na sincronização:', error);
    
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
