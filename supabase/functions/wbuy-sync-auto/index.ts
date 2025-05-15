
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.1'
import { serve } from 'https://deno.land/std@0.177.0/http/server.ts'

// URL e chaves do projeto Supabase
const supabaseUrl = 'https://zkjpzwrcuauieaaktzbk.supabase.co'
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || ''

// Configurações da API Wbuy
const WBUY_API_URL = 'https://sistema.sistemawbuy.com.br/api/v1'
const WBUY_STORE_ID = 'f9d1cd0e-2826-4b79-897b-a2169ccf7f9e'
const WBUY_API_TOKEN = 'ZjlkMWNkMGUtMjgyNi00Yjc5LTg5N2ItYTIxNjljY2Y3ZjllOmI3ZDU3Yjk4ZmUxMzRjOWY5OGI1NmM2Zjg3YjRjNTA3'

// Inicializa o cliente Supabase
const supabase = createClient(supabaseUrl, supabaseServiceKey)

// Define o período para buscar pedidos recentes (últimas 24 horas por padrão)
const getTimeRange = () => {
  const endDate = new Date()
  const startDate = new Date()
  startDate.setHours(startDate.getHours() - 24)  // Últimas 24 horas
  
  return {
    startDate: startDate.toISOString(),
    endDate: endDate.toISOString()
  }
}

// Função para buscar pedidos da API Wbuy
async function fetchWbuyOrders(startDate: string, endDate: string): Promise<any[]> {
  console.log(`Sincronização automática: Buscando pedidos de ${startDate} até ${endDate}...`)
  
  try {
    const url = `${WBUY_API_URL}/orders?start_date=${encodeURIComponent(startDate)}&end_date=${encodeURIComponent(endDate)}&page=1&limit=100`

    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${WBUY_API_TOKEN}`,
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      throw new Error(`Erro na API Wbuy: ${response.status} ${await response.text()}`)
    }

    const data = await response.json()

    if (!data || !data.data || !Array.isArray(data.data)) {
      console.warn('Resposta da API Wbuy em formato inesperado:', data)
      return []
    }

    return data.data
  } catch (error) {
    console.error('Erro ao buscar pedidos da Wbuy:', error)
    return []
  }
}

// Função para processar e salvar pedidos no Supabase
async function processAndSaveOrders(orders: any[]): Promise<{ savedCount: number; errors: any[] }> {
  console.log(`Sincronização automática: Processando ${orders.length} pedidos...`)
  
  const errors = []
  let savedCount = 0

  const ordersToInsert = orders.map((order) => {
    const orderDate = new Date(order.created_at || order.date)
    return {
      order_id: order.id || order.order_id,
      customer_name: order.customer?.name || order.customer_name || null,
      customer_email: order.customer?.email || order.email || null,
      affiliate_code: order.affiliate_code || order.producer_code || null,
      value: parseFloat(order.total || order.value || '0'),
      status: order.status || 'approved',
      payment_method: order.payment_method || order.payment_type || null,
      products: Array.isArray(order.products) ? order.products : null,
      order_date: orderDate.toISOString(),
      year: orderDate.getFullYear(),
      month: orderDate.getMonth() + 1, // Mês começa do 0, então somamos 1
    }
  })

  try {
    if (ordersToInsert.length > 0) {
      const { data, error } = await supabase
        .from('wbuy_orders')
        .upsert(ordersToInsert, { 
          onConflict: 'order_id',
          ignoreDuplicates: false 
        })

      if (error) {
        console.error('Erro ao salvar pedidos:', error)
        errors.push({
          error: error.message,
        })
      } else {
        savedCount = ordersToInsert.length
        console.log(`Sincronização automática: ${savedCount} pedidos salvos com sucesso`)
      }
    }
  } catch (error) {
    console.error('Exceção ao salvar pedidos:', error)
    errors.push({
      error: error instanceof Error ? error.message : 'Erro desconhecido',
    })
  }

  return { savedCount, errors }
}

// Função para gerar estatísticas por período
async function generateStats(): Promise<void> {
  console.log('Sincronização automática: Gerando estatísticas...')

  try {
    // Estatísticas por ano
    await supabase.rpc('generate_wbuy_stats', { 
      period_type: 'year',
      limit_days: null
    })
    
    // Estatísticas por mês
    await supabase.rpc('generate_wbuy_stats', { 
      period_type: 'month',
      limit_days: null
    })
    
    // Estatísticas por dia (últimos 30 dias)
    await supabase.rpc('generate_wbuy_stats', { 
      period_type: 'day',
      limit_days: 30
    })
    
    console.log('Sincronização automática: Estatísticas geradas com sucesso!')
  } catch (error) {
    console.error('Erro ao gerar estatísticas:', error)
  }
}

// Função para registrar o histórico de sincronização
async function logSyncHistory(results: { savedCount: number; errors: any[] }): Promise<void> {
  try {
    const { error } = await supabase
      .from('wbuy_sync_status')
      .insert({
        status: results.errors.length > 0 ? 'concluido_com_erros' : 'concluido',
        details: {
          summary: `Sincronização automática: ${results.savedCount} pedidos processados com sucesso, ${results.errors.length} erros`,
          errors: results.errors.length > 0 ? results.errors : null,
        },
        total_records_processed: results.savedCount,
      })

    if (error) {
      console.error('Erro ao registrar histórico de sincronização:', error)
    }
  } catch (error) {
    console.error('Exceção ao registrar histórico:', error)
  }
}

// Função principal que será executada pelo agendador cron
async function autoSyncWbuy(): Promise<{
  success: boolean;
  message: string;
  ordersProcessed: number;
}> {
  try {
    // Define o período para sincronização (últimas 24 horas)
    const { startDate, endDate } = getTimeRange()
    
    // Busca pedidos recentes
    const orders = await fetchWbuyOrders(startDate, endDate)
    
    // Se não houver pedidos, finaliza com sucesso
    if (orders.length === 0) {
      console.log('Sincronização automática: Nenhum pedido novo encontrado.')
      return {
        success: true,
        message: 'Nenhum pedido novo encontrado',
        ordersProcessed: 0
      }
    }
    
    // Processa e salva os pedidos
    const results = await processAndSaveOrders(orders)
    
    // Gera estatísticas atualizadas
    await generateStats()
    
    // Registra o histórico de sincronização
    await logSyncHistory(results)
    
    return {
      success: true,
      message: `Sincronização automática concluída: ${results.savedCount} pedidos processados`,
      ordersProcessed: results.savedCount
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido'
    console.error('Erro na sincronização automática:', errorMessage)
    
    return {
      success: false,
      message: `Erro na sincronização automática: ${errorMessage}`,
      ordersProcessed: 0
    }
  }
}

// Handler para a função Edge
serve(async (req) => {
  // Verifica se é uma requisição HTTP ou uma execução agendada
  const isCronInvocation = req.headers.get('user-agent')?.includes('supabase-cron') || false
  
  try {
    const result = await autoSyncWbuy()
    
    return new Response(
      JSON.stringify(result),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    )
  } catch (error) {
    console.error('Erro na sincronização automática:', error)
    
    return new Response(
      JSON.stringify({
        success: false,
        error: error instanceof Error ? error.message : 'Erro desconhecido',
      }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    )
  }
})
