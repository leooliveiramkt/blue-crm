
// Função para gerar estatísticas por período
export async function generateStats(supabase: any): Promise<void> {
  console.log('Gerando estatísticas...');

  try {
    // Estatísticas por ano
    await generateStatsByPeriod(supabase, 'year');
    
    // Estatísticas por mês
    await generateStatsByPeriod(supabase, 'month');
    
    // Estatísticas por dia (últimos 30 dias)
    await generateStatsByPeriod(supabase, 'day', 30);
    
    console.log('Estatísticas geradas com sucesso!');
  } catch (error) {
    console.error('Erro ao gerar estatísticas:', error);
    throw error;
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
  });

  const { data, error } = await query;

  if (error) {
    console.error(`Erro ao gerar estatísticas por ${periodType}:`, error);
    throw error;
  }

  console.log(`Estatísticas por ${periodType} geradas:`, data);
}
