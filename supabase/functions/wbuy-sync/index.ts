
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.1'
import { serve } from 'https://deno.land/std@0.177.0/http/server.ts'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// URL e chaves do projeto Supabase
const supabaseUrl = 'https://zkjpzwrcuauieaaktzbk.supabase.co'
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || ''

// Configurações da API Wbuy
const WBUY_API_URL = 'https://sistema.sistemawbuy.com.br/api/v1'
const WBUY_STORE_ID = 'f9d1cd0e-2826-4b79-897b-a2169ccf7f9e'
const WBUY_API_TOKEN = 'ZjlkMWNkMGUtMjgyNi00Yjc5LTg5N2ItYTIxNjljY2Y3ZjllOmI3ZDU3Yjk4ZmUxMzRjOWY5OGI1NmM2Zjg3YjRjNTA3'

// Função para formatar data para ISO string
function formatDate(date: Date): string {
  return date.toISOString()
}

// Função auxiliar para criar registro de status da sincronização
async function createSyncRecord(
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
    .single()

  if (error) {
    console.error('Erro ao criar registro de sincronização:', error)
    throw error
  }

  return data.id
}

// Função para atualizar o registro de sincronização
async function updateSyncRecord(
  supabase: any,
  syncId: string,
  status: string,
  details?: any,
  recordsProcessed?: number
): Promise<void> {
  const updateData: any = {
    status,
    updated_at: new Date().toISOString(),
  }

  if (details) {
    updateData.details = details
  }

  if (recordsProcessed !== undefined) {
    updateData.total_records_processed = recordsProcessed
  }

  const { error } = await supabase
    .from('wbuy_sync_status')
    .update(updateData)
    .eq('id', syncId)

  if (error) {
    console.error('Erro ao atualizar registro de sincronização:', error)
    throw error
  }
}

// Função para buscar ordens da API Wbuy
async function fetchWbuyOrders(
  startDate: string,
  endDate: string,
  page: number = 1,
  ordersAccumulator: any[] = []
): Promise<any[]> {
  console.log(`Buscando página ${page} de pedidos da Wbuy...`)
  
  try {
    const url = `${WBUY_API_URL}/orders?start_date=${encodeURIComponent(
      startDate
    )}&end_date=${encodeURIComponent(endDate)}&page=${page}&limit=100`

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
      return ordersAccumulator
    }

    const combinedOrders = [...ordersAccumulator, ...data.data]

    // Verifica se há mais páginas
    if (data.meta && data.meta.total_pages > page) {
      return fetchWbuyOrders(startDate, endDate, page + 1, combinedOrders)
    }

    return combinedOrders
  } catch (error) {
    console.error('Erro ao buscar pedidos da Wbuy:', error)
    throw error
  }
}

// Função para processar e salvar pedidos no Supabase
async function processAndSaveOrders(
  supabase: any,
  orders: any[]
): Promise<{ savedCount: number; errors: any[] }> {
  console.log(`Processando ${orders.length} pedidos...`)
  
  const errors = []
  let savedCount = 0

  // Processa em lotes para evitar limites de tamanho de requisição
  const batchSize = 50
  for (let i = 0; i < orders.length; i += batchSize) {
    const batch = orders.slice(i, i + batchSize)
    const ordersToInsert = batch.map((order) => {
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
      const { data, error } = await supabase
        .from('wbuy_orders')
        .upsert(ordersToInsert, { 
          onConflict: 'order_id',
          ignoreDuplicates: false 
        })

      if (error) {
        console.error('Erro ao salvar lote de pedidos:', error)
        errors.push({
          batch: i / batchSize,
          error: error.message,
        })
      } else {
        savedCount += ordersToInsert.length
        console.log(`Lote ${i / batchSize + 1} salvo com sucesso: ${ordersToInsert.length} pedidos`)
      }
    } catch (error) {
      console.error('Exceção ao salvar lote de pedidos:', error)
      errors.push({
        batch: i / batchSize,
        error: error instanceof Error ? error.message : 'Erro desconhecido',
      })
    }

    // Pausa breve para evitar sobrecarga
    await new Promise((resolve) => setTimeout(resolve, 100))
  }

  return { savedCount, errors }
}

// Função para gerar estatísticas por período
async function generateStats(supabase: any): Promise<void> {
  console.log('Gerando estatísticas...')

  try {
    // Estatísticas por ano
    await generateStatsByPeriod(supabase, 'year')
    
    // Estatísticas por mês
    await generateStatsByPeriod(supabase, 'month')
    
    // Estatísticas por dia (últimos 30 dias)
    await generateStatsByPeriod(supabase, 'day', 30)
    
    console.log('Estatísticas geradas com sucesso!')
  } catch (error) {
    console.error('Erro ao gerar estatísticas:', error)
    throw error
  }
}

// Função auxiliar para gerar estatísticas por tipo de período
async function generateStatsByPeriod(
  supabase: any, 
  periodType: 'year' | 'month' | 'day',
  limitDays?: number
): Promise<void> {
  let query = supabase.rpc('generate_wbuy_stats', { 
    period_type: periodType,
    limit_days: limitDays || null
  })

  const { data, error } = await query

  if (error) {
    console.error(`Erro ao gerar estatísticas por ${periodType}:`, error)
    throw error
  }

  console.log(`Estatísticas por ${periodType} geradas:`, data)
}

serve(async (req) => {
  // Tratar preflight requests para CORS
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Inicializa o cliente Supabase com a service role key
    const supabase = createClient(supabaseUrl, supabaseServiceKey)
    
    // Parâmetros da requisição
    const url = new URL(req.url)
    const startDateParam = url.searchParams.get('startDate')
    const endDateParam = url.searchParams.get('endDate')
    const fullSync = url.searchParams.get('fullSync') === 'true'

    // Validação das datas
    let startDate: string
    let endDate: string

    if (startDateParam && endDateParam) {
      startDate = startDateParam
      endDate = endDateParam
    } else if (fullSync) {
      // Para sincronização completa, definimos um período amplo
      const oldestDate = new Date(2020, 0, 1) // 1º de janeiro de 2020
      startDate = formatDate(oldestDate)
      endDate = formatDate(new Date()) // Data atual
    } else {
      // Por padrão, sincroniza os últimos 30 dias
      const thirtyDaysAgo = new Date()
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
      startDate = formatDate(thirtyDaysAgo)
      endDate = formatDate(new Date())
    }

    console.log(`Iniciando sincronização de dados da Wbuy de ${startDate} até ${endDate}`)

    // Cria registro de sincronização
    const syncId = await createSyncRecord(supabase, 'em_andamento', {
      start_date: startDate,
      end_date: endDate,
      full_sync: fullSync,
    })

    try {
      // Busca os pedidos da Wbuy
      const orders = await fetchWbuyOrders(startDate, endDate)
      
      // Atualiza o registro de sincronização
      await updateSyncRecord(
        supabase,
        syncId,
        'processando',
        { total_orders: orders.length }
      )

      // Processa e salva os pedidos
      const { savedCount, errors } = await processAndSaveOrders(supabase, orders)

      // Gera estatísticas
      await generateStats(supabase)

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
      )

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
      )
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
      )

      throw error
    }
  } catch (error) {
    console.error('Erro na sincronização:', error)
    
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
    )
  }
})
