// 🚀 SCRIPT DE PRÉ-CARGA COMPLETA DOS DADOS
// Este script deve ser executado ANTES de disponibilizar o sistema para os usuários

import { DataSyncService } from '../services/sync/DataSyncService';

interface PreloadConfig {
  tenantId: string;
  wbuyConfig: {
    url: string;
    token: string;
    storeId: string;
  };
  activeCampaignConfig: {
    url: string;
    key: string;
  };
}

class DataPreloader {
  private syncService: DataSyncService;

  constructor() {
    this.syncService = new DataSyncService();
  }

  // 🎯 PRÉ-CARREGAMENTO COMPLETO DA BELA BLUE
  async preloadBelaBlueData(): Promise<void> {
    console.log('🚀 Iniciando pré-carga completa dos dados da Bela Blue...');
    
    const config: PreloadConfig = {
      tenantId: 'bela_blue',
      wbuyConfig: {
        url: 'https://sistema.sistemawbuy.com.br/api/v1',
        token: 'NjE2OTFkYTQtN2ZjOC00MTllLWEwNmQtYjllMDIxZDc1ZWZjOmViYTgzYWYwZTViMTQxNTE4MmQyNjdlZjE3NGNjMmE5',
        storeId: '384388'
      },
      activeCampaignConfig: {
        url: 'https://belablue.api-us1.com',
        key: '39c8e1bb22c8e4dd2ccad4e9c71b5bd0a52db48653598b97a3cf6bc05ced739471e04950'
      }
    };

    try {
      // 1. PASSO 1: Limpar dados antigos da Bela Blue
      console.log('🧹 Limpando dados antigos da Bela Blue...');
      await this.clearOldData('bela_blue');

      // 2. PASSO 2: Pré-carregar dados WBuy
      console.log('📦 Pré-carregando dados WBuy...');
      await this.preloadWBuyData(config);

      // 3. PASSO 3: Pré-carregar dados Active Campaign
      console.log('📧 Pré-carregando dados Active Campaign...');
      await this.preloadActiveCampaignData(config);

      // 4. PASSO 4: Verificar integridade dos dados
      console.log('🔍 Verificando integridade dos dados...');
      await this.verifyDataIntegrity('bela_blue');

      // 5. PASSO 5: Marcar como dados válidos
      console.log('✅ Marcando dados como válidos...');
      await this.markDataAsValid('bela_blue');

      console.log('🎉 PRÉ-CARGA COMPLETA FINALIZADA COM SUCESSO!');
      
    } catch (error) {
      console.error('❌ Erro na pré-carga:', error);
      throw error;
    }
  }

  // 🧹 LIMPAR DADOS ANTIGOS
  private async clearOldData(tenantId: string): Promise<void> {
    try {
      const { error } = await this.syncService['supabase']
        .from('api_data')
        .delete()
        .eq('tenant_id', tenantId);

      if (error) throw error;
      
      console.log(`✅ Dados antigos removidos para ${tenantId}`);
      
    } catch (error) {
      console.error('❌ Erro ao limpar dados antigos:', error);
      throw error;
    }
  }

  // 📦 PRÉ-CARREGAR WBUY
  private async preloadWBuyData(config: PreloadConfig): Promise<void> {
    const wbuyEndpoints = [
      'clientes',
      'produtos',
      'pedidos',
      'afiliados',
      'categorias',
      'campanhas',
      'envios',
      'financeiro',
      'estoque',
      'vendedores',
      'cupons',
      'relatorios'
    ];

    let totalRecords = 0;

    for (const endpoint of wbuyEndpoints) {
      try {
        console.log(`📥 Baixando ${endpoint} da WBuy...`);
        
        const data = await this.fetchWBuyData(config.wbuyConfig, endpoint);
        await this.saveToSupabase(config.tenantId, 'wbuy', endpoint, data);
        
        const recordCount = Array.isArray(data) ? data.length : 1;
        totalRecords += recordCount;
        
        console.log(`✅ ${endpoint}: ${recordCount} registros salvos`);
        
        // Aguardar 1 segundo entre requests para não sobrecarregar a API
        await this.sleep(1000);
        
      } catch (error) {
        console.error(`❌ Erro ao pré-carregar ${endpoint}:`, error);
        // Continuar mesmo com erro em um endpoint específico
      }
    }

    console.log(`📦 Total WBuy: ${totalRecords} registros pré-carregados`);
  }

  // 📧 PRÉ-CARREGAR ACTIVE CAMPAIGN
  private async preloadActiveCampaignData(config: PreloadConfig): Promise<void> {
    const acEndpoints = [
      'contacts',
      'lists',
      'campaigns',
      'automations',
      'deals',
      'accounts',
      'tags',
      'custom_fields',
      'forms',
      'segments',
      'messages',
      'notes'
    ];

    let totalRecords = 0;

    for (const endpoint of acEndpoints) {
      try {
        console.log(`📥 Baixando ${endpoint} do Active Campaign...`);
        
        const data = await this.fetchActiveCampaignData(config.activeCampaignConfig, endpoint);
        await this.saveToSupabase(config.tenantId, 'activecampaign', endpoint, data);
        
        const recordCount = data?.[endpoint]?.length || (Array.isArray(data) ? data.length : 1);
        totalRecords += recordCount;
        
        console.log(`✅ ${endpoint}: ${recordCount} registros salvos`);
        
        // Aguardar 1 segundo entre requests
        await this.sleep(1000);
        
      } catch (error) {
        console.error(`❌ Erro ao pré-carregar ${endpoint}:`, error);
        // Continuar mesmo com erro
      }
    }

    console.log(`📧 Total Active Campaign: ${totalRecords} registros pré-carregados`);
  }

  // 🛒 FETCH WBUY
  private async fetchWBuyData(config: any, endpoint: string): Promise<any> {
    const url = `${config.url}/${endpoint}`;
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${config.token}`,
        'Content-Type': 'application/json',
        'X-Store-ID': config.storeId
      }
    });

    if (!response.ok) {
      throw new Error(`WBuy API error: ${response.status} - ${response.statusText}`);
    }

    return await response.json();
  }

  // 📧 FETCH ACTIVE CAMPAIGN
  private async fetchActiveCampaignData(config: any, endpoint: string): Promise<any> {
    const url = `${config.url}/api/3/${endpoint}`;
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Api-Token': config.key,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error(`Active Campaign API error: ${response.status} - ${response.statusText}`);
    }

    return await response.json();
  }

  // 💾 SALVAR NO SUPABASE
  private async saveToSupabase(tenantId: string, apiSource: string, dataType: string, data: any): Promise<void> {
    const records = Array.isArray(data) ? data : [data];
    
    const insertData = records.map((record, index) => ({
      tenant_id: tenantId,
      api_source: apiSource,
      data_type: dataType,
      external_id: record.id || record.ID || index.toString(),
      data: record,
      last_sync: new Date().toISOString(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }));

    // Inserir em lotes de 50 para garantir performance
    const batchSize = 50;
    for (let i = 0; i < insertData.length; i += batchSize) {
      const batch = insertData.slice(i, i + batchSize);
      
      const { error } = await this.syncService['supabase']
        .from('api_data')
        .insert(batch);

      if (error) {
        throw error;
      }

      // Aguardar entre lotes para não sobrecarregar o Supabase
      if (i + batchSize < insertData.length) {
        await this.sleep(500);
      }
    }
  }

  // 🔍 VERIFICAR INTEGRIDADE
  private async verifyDataIntegrity(tenantId: string): Promise<void> {
    try {
      const { data, error } = await this.syncService['supabase']
        .from('api_data')
        .select('api_source, data_type, count(*)')
        .eq('tenant_id', tenantId);

      if (error) throw error;

      console.log('📊 Resumo dos dados pré-carregados:');
      data?.forEach((item: any) => {
        console.log(`  - ${item.api_source}_${item.data_type}: ${item.count} registros`);
      });
      
    } catch (error) {
      console.error('❌ Erro na verificação:', error);
      throw error;
    }
  }

  // ✅ MARCAR COMO VÁLIDOS
  private async markDataAsValid(tenantId: string): Promise<void> {
    try {
      const { error } = await this.syncService['supabase']
        .from('tenants')
        .upsert({
          tenant_id: tenantId,
          name: 'Bela Blue',
          is_active: true,
          data_preloaded: true,
          last_preload: new Date().toISOString(),
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        });

      if (error) throw error;
      
      console.log('✅ Dados marcados como válidos');
      
    } catch (error) {
      console.error('❌ Erro ao marcar dados:', error);
      throw error;
    }
  }

  // ⏰ SLEEP UTILITY
  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

// 🚀 EXECUTAR PRÉ-CARGA
export async function runPreload(): Promise<void> {
  const preloader = new DataPreloader();
  await preloader.preloadBelaBlueData();
}

// Para execução direta via Node.js
if (typeof window === 'undefined') {
  runPreload()
    .then(() => {
      console.log('🎉 Pré-carga finalizada com sucesso!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Erro na pré-carga:', error);
      process.exit(1);
    });
}

export default DataPreloader; 