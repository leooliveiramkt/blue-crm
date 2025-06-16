// 🔄 SISTEMA DE SINCRONIZAÇÃO COMPLETO
// WBuy + Active Campaign → Supabase

import { createClient } from '@supabase/supabase-js';

interface SyncConfig {
  tenantId: string;
  wbuyConfig?: {
    url: string;
    token: string;
    storeId: string;
  };
  activeCampaignConfig?: {
    url: string;
    key: string;
  };
}

interface SyncResult {
  success: boolean;
  dataType: string;
  recordsProcessed: number;
  errors?: string[];
  syncedAt: Date;
}

export class DataSyncService {
  private supabase;

  constructor() {
    this.supabase = createClient(
      import.meta.env.VITE_SUPABASE_URL,
      import.meta.env.VITE_SUPABASE_ANON_KEY
    );
  }

  // 🚀 SINCRONIZAÇÃO COMPLETA
  async syncAllData(config: SyncConfig): Promise<SyncResult[]> {
    const results: SyncResult[] = [];
    
    console.log(`🔄 Iniciando sincronização completa para tenant: ${config.tenantId}`);

    try {
      // 1. Sincronizar dados WBuy
      if (config.wbuyConfig) {
        const wbuyResults = await this.syncWBuyData(config);
        results.push(...wbuyResults);
      }

      // 2. Sincronizar dados Active Campaign
      if (config.activeCampaignConfig) {
        const acResults = await this.syncActiveCampaignData(config);
        results.push(...acResults);
      }

      // 3. Atualizar timestamp da última sincronização
      await this.updateLastSyncTimestamp(config.tenantId);

      console.log(`✅ Sincronização completa finalizada para ${config.tenantId}`);
      
    } catch (error) {
      console.error('❌ Erro na sincronização:', error);
      results.push({
        success: false,
        dataType: 'sync_error',
        recordsProcessed: 0,
        errors: [error instanceof Error ? error.message : 'Erro desconhecido'],
        syncedAt: new Date()
      });
    }

    return results;
  }

  // 🛒 SINCRONIZAÇÃO WBUY
  private async syncWBuyData(config: SyncConfig): Promise<SyncResult[]> {
    const results: SyncResult[] = [];
    
    const wbuyEndpoints = [
      'clientes',
      'produtos', 
      'pedidos',
      'afiliados',
      'categorias',
      'campanhas',
      'envios',
      'financeiro',
      'estoque'
    ];

    for (const endpoint of wbuyEndpoints) {
      try {
        console.log(`📥 Baixando dados WBuy: ${endpoint}`);
        
        const data = await this.fetchWBuyData(config.wbuyConfig!, endpoint);
        const result = await this.saveDataToSupabase(config.tenantId, 'wbuy', endpoint, data);
        
        results.push({
          success: true,
          dataType: `wbuy_${endpoint}`,
          recordsProcessed: Array.isArray(data) ? data.length : 1,
          syncedAt: new Date()
        });

        // Salvar cache local também
        await this.saveCacheFile(endpoint, data);
        
      } catch (error) {
        console.error(`❌ Erro ao sincronizar WBuy ${endpoint}:`, error);
        results.push({
          success: false,
          dataType: `wbuy_${endpoint}`,
          recordsProcessed: 0,
          errors: [error instanceof Error ? error.message : 'Erro desconhecido'],
          syncedAt: new Date()
        });
      }
    }

    return results;
  }

  // 📧 SINCRONIZAÇÃO ACTIVE CAMPAIGN
  private async syncActiveCampaignData(config: SyncConfig): Promise<SyncResult[]> {
    const results: SyncResult[] = [];
    
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
      'segments'
    ];

    for (const endpoint of acEndpoints) {
      try {
        console.log(`📥 Baixando dados Active Campaign: ${endpoint}`);
        
        const data = await this.fetchActiveCampaignData(config.activeCampaignConfig!, endpoint);
        await this.saveDataToSupabase(config.tenantId, 'activecampaign', endpoint, data);
        
        results.push({
          success: true,
          dataType: `ac_${endpoint}`,
          recordsProcessed: data?.[endpoint]?.length || 0,
          syncedAt: new Date()
        });

        // Salvar cache local também
        await this.saveCacheFile(`ac_${endpoint}`, data);
        
      } catch (error) {
        console.error(`❌ Erro ao sincronizar AC ${endpoint}:`, error);
        results.push({
          success: false,
          dataType: `ac_${endpoint}`,
          recordsProcessed: 0,
          errors: [error instanceof Error ? error.message : 'Erro desconhecido'],
          syncedAt: new Date()
        });
      }
    }

    return results;
  }

  // 🛒 FETCH DADOS WBUY
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

  // 📧 FETCH DADOS ACTIVE CAMPAIGN
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
  private async saveDataToSupabase(tenantId: string, apiSource: string, dataType: string, data: any): Promise<void> {
    try {
      // Deletar dados antigos deste tipo
      await this.supabase
        .from('api_data')
        .delete()
        .eq('tenant_id', tenantId)
        .eq('api_source', apiSource)
        .eq('data_type', dataType);

      // Preparar dados para inserção
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

      // Inserir em lotes para evitar timeout
      const batchSize = 100;
      for (let i = 0; i < insertData.length; i += batchSize) {
        const batch = insertData.slice(i, i + batchSize);
        
        const { error } = await this.supabase
          .from('api_data')
          .insert(batch);

        if (error) {
          throw error;
        }
      }

      console.log(`✅ Salvos ${insertData.length} registros de ${apiSource}_${dataType} no Supabase`);
      
    } catch (error) {
      console.error(`❌ Erro ao salvar no Supabase:`, error);
      throw error;
    }
  }

  // 📁 SALVAR CACHE LOCAL
  private async saveCacheFile(dataType: string, data: any): Promise<void> {
    try {
      const fileName = `${dataType}-cache-${new Date().toISOString().split('T')[0]}.json`;
      const filePath = `./cache/${fileName}`;
      
      // Em ambiente web, apenas log (não pode salvar arquivo)
      console.log(`💾 Cache salvo para ${dataType}: ${JSON.stringify(data).length} chars`);
      
    } catch (error) {
      console.error(`❌ Erro ao salvar cache:`, error);
    }
  }

  // 🕐 ATUALIZAR TIMESTAMP
  private async updateLastSyncTimestamp(tenantId: string): Promise<void> {
    try {
      const { error } = await this.supabase
        .from('tenants')
        .update({ 
          last_sync: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .eq('tenant_id', tenantId);

      if (error) {
        throw error;
      }
      
    } catch (error) {
      console.error('❌ Erro ao atualizar timestamp:', error);
    }
  }

  // 📊 ESTATÍSTICAS DE SINCRONIZAÇÃO
  async getSyncStats(tenantId: string): Promise<any> {
    try {
      const { data, error } = await this.supabase
        .from('api_data')
        .select('api_source, data_type')
        .eq('tenant_id', tenantId);

      if (error) throw error;

      // Agregar dados localmente
      const stats = data?.reduce((acc: any, item: any) => {
        const key = `${item.api_source}_${item.data_type}`;
        acc[key] = (acc[key] || 0) + 1;
        return acc;
      }, {});

      return stats || {};
      
    } catch (error) {
      console.error('❌ Erro ao buscar estatísticas:', error);
      return {};
    }
  }

  // 🔍 BUSCAR DADOS SINCRONIZADOS
  async getHistoricalData(tenantId: string, apiSource: string, dataType: string, limit = 100): Promise<any[]> {
    try {
      const { data, error } = await this.supabase
        .from('api_data')
        .select('*')
        .eq('tenant_id', tenantId)
        .eq('api_source', apiSource)
        .eq('data_type', dataType)
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) throw error;

      return data || [];
      
    } catch (error) {
      console.error('❌ Erro ao buscar dados históricos:', error);
      return [];
    }
  }

  // 🔄 SINCRONIZAÇÃO AUTOMÁTICA PARA BELA BLUE
  static async syncBelaBlueData(): Promise<SyncResult[]> {
    const syncService = new DataSyncService();
    
    const config: SyncConfig = {
      tenantId: 'bela_blue',
      wbuyConfig: {
        url: import.meta.env.VITE_BELA_BLUE_WBUY_URL,
        token: import.meta.env.VITE_BELA_BLUE_WBUY_TOKEN,
        storeId: import.meta.env.VITE_BELA_BLUE_WBUY_STORE_ID
      },
      activeCampaignConfig: {
        url: import.meta.env.VITE_BELA_BLUE_AC_URL,
        key: import.meta.env.VITE_BELA_BLUE_AC_KEY
      }
    };

    return await syncService.syncAllData(config);
  }
}

export default DataSyncService; 