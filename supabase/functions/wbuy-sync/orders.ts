
import { WBUY_API_URL, WBUY_API_TOKEN } from './utils.ts';

// Função para buscar ordens da API Wbuy
export async function fetchWbuyOrders(
  startDate: string,
  endDate: string,
  page: number = 1,
  ordersAccumulator: any[] = []
): Promise<any[]> {
  console.log(`Buscando página ${page} de pedidos da Wbuy...`);
  
  try {
    const url = `${WBUY_API_URL}/orders?start_date=${encodeURIComponent(
      startDate
    )}&end_date=${encodeURIComponent(endDate)}&page=${page}&limit=100`;

    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${WBUY_API_TOKEN}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Erro na API Wbuy: ${response.status} ${await response.text()}`);
    }

    const data = await response.json();

    if (!data || !data.data || !Array.isArray(data.data)) {
      console.warn('Resposta da API Wbuy em formato inesperado:', data);
      return ordersAccumulator;
    }

    const combinedOrders = [...ordersAccumulator, ...data.data];

    // Verifica se há mais páginas
    if (data.meta && data.meta.total_pages > page) {
      return fetchWbuyOrders(startDate, endDate, page + 1, combinedOrders);
    }

    return combinedOrders;
  } catch (error) {
    console.error('Erro ao buscar pedidos da Wbuy:', error);
    throw error;
  }
}

// Função para processar e salvar pedidos no Supabase
export async function processAndSaveOrders(
  supabase: any,
  orders: any[]
): Promise<{ savedCount: number; errors: any[] }> {
  console.log(`Processando ${orders.length} pedidos...`);
  
  const errors = [];
  let savedCount = 0;

  // Processa em lotes para evitar limites de tamanho de requisição
  const batchSize = 50;
  for (let i = 0; i < orders.length; i += batchSize) {
    const batch = orders.slice(i, i + batchSize);
    const ordersToInsert = batch.map((order) => {
      const orderDate = new Date(order.created_at || order.date);
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
      };
    });

    try {
      const { data, error } = await supabase
        .from('wbuy_orders')
        .upsert(ordersToInsert, { 
          onConflict: 'order_id',
          ignoreDuplicates: false 
        });

      if (error) {
        console.error('Erro ao salvar lote de pedidos:', error);
        errors.push({
          batch: i / batchSize,
          error: error.message,
        });
      } else {
        savedCount += ordersToInsert.length;
        console.log(`Lote ${i / batchSize + 1} salvo com sucesso: ${ordersToInsert.length} pedidos`);
      }
    } catch (error) {
      console.error('Exceção ao salvar lote de pedidos:', error);
      errors.push({
        batch: i / batchSize,
        error: error instanceof Error ? error.message : 'Erro desconhecido',
      });
    }

    // Pausa breve para evitar sobrecarga
    await new Promise((resolve) => setTimeout(resolve, 100));
  }

  return { savedCount, errors };
}
