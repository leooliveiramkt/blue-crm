// ⏰ SERVIÇO DE SINCRONIZAÇÃO AUTOMÁTICA
// Sincroniza dados WBuy + Active Campaign a cada minuto

import { DataSyncService } from './DataSyncService';

interface AutoSyncConfig {
  intervalMinutes: number;
  tenants: Array<{
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
  }>;
}

export class AutoSyncService {
  private syncService: DataSyncService;
  private intervalId: NodeJS.Timeout | null = null;
  private isRunning = false;
  private config: AutoSyncConfig;

  constructor(config: AutoSyncConfig) {
    this.syncService = new DataSyncService();
    this.config = config;
  }

  // 🚀 INICIAR SINCRONIZAÇÃO AUTOMÁTICA
  start(): void {
    if (this.isRunning) {
      console.log('⚠️ Sincronização automática já está rodando');
      return;
    }

    console.log(`🚀 Iniciando sincronização automática a cada ${this.config.intervalMinutes} minuto(s)`);
    
    this.isRunning = true;
    
    // Executar primeira sincronização imediatamente
    this.executeSyncCycle();
    
    // Configurar execução periódica
    this.intervalId = setInterval(() => {
      this.executeSyncCycle();
    }, this.config.intervalMinutes * 60 * 1000);
  }

  // ⏹️ PARAR SINCRONIZAÇÃO AUTOMÁTICA
  stop(): void {
    if (!this.isRunning) {
      console.log('⚠️ Sincronização automática não está rodando');
      return;
    }

    console.log('⏹️ Parando sincronização automática...');
    
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
    
    this.isRunning = false;
    console.log('✅ Sincronização automática parada');
  }

  // 🔄 EXECUTAR CICLO DE SINCRONIZAÇÃO
  private async executeSyncCycle(): Promise<void> {
    console.log(`🔄 Iniciando ciclo de sincronização - ${new Date().toLocaleString()}`);
    
    try {
      for (const tenant of this.config.tenants) {
        await this.syncTenant(tenant);
        
        // Aguardar 30 segundos entre tenants para não sobrecarregar as APIs
        await this.sleep(30000);
      }
      
      console.log('✅ Ciclo de sincronização completo');
      
    } catch (error) {
      console.error('❌ Erro no ciclo de sincronização:', error);
    }
  }

  // 🏢 SINCRONIZAR TENANT ESPECÍFICO
  private async syncTenant(tenant: any): Promise<void> {
    try {
      console.log(`📊 Sincronizando tenant: ${tenant.tenantId}`);
      
      const results = await this.syncService.syncAllData(tenant);
      
      // Log dos resultados
      const successCount = results.filter(r => r.success).length;
      const errorCount = results.filter(r => !r.success).length;
      
      console.log(`✅ Tenant ${tenant.tenantId}: ${successCount} sucessos, ${errorCount} erros`);
      
      if (errorCount > 0) {
        console.log('❌ Erros encontrados:');
        results
          .filter(r => !r.success)
          .forEach(r => console.log(`  - ${r.dataType}: ${r.errors?.join(', ')}`));
      }
      
    } catch (error) {
      console.error(`❌ Erro ao sincronizar tenant ${tenant.tenantId}:`, error);
    }
  }

  // 📊 STATUS DA SINCRONIZAÇÃO
  getStatus(): {
    isRunning: boolean;
    intervalMinutes: number;
    tenantsCount: number;
    nextRun: Date | null;
  } {
    const nextRun = this.isRunning && this.intervalId
      ? new Date(Date.now() + this.config.intervalMinutes * 60 * 1000)
      : null;

    return {
      isRunning: this.isRunning,
      intervalMinutes: this.config.intervalMinutes,
      tenantsCount: this.config.tenants.length,
      nextRun
    };
  }

  // ⏰ SLEEP UTILITY
  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // 🔧 ATUALIZAR CONFIGURAÇÃO
  updateConfig(newConfig: Partial<AutoSyncConfig>): void {
    this.config = { ...this.config, ...newConfig };
    
    if (this.isRunning) {
      console.log('🔄 Reiniciando com nova configuração...');
      this.stop();
      this.start();
    }
  }

  // 📈 ESTATÍSTICAS DE SINCRONIZAÇÃO
  async getSyncStatistics(): Promise<any> {
    const stats: any = {};
    
    for (const tenant of this.config.tenants) {
      try {
        const tenantStats = await this.syncService.getSyncStats(tenant.tenantId);
        stats[tenant.tenantId] = tenantStats;
      } catch (error) {
        console.error(`❌ Erro ao buscar stats para ${tenant.tenantId}:`, error);
        stats[tenant.tenantId] = { error: error instanceof Error ? error.message : 'Erro desconhecido' };
      }
    }
    
    return stats;
  }
}

// 🏗️ FACTORY PARA CRIAR INSTÂNCIA COM CONFIGURAÇÃO PADRÃO
export function createAutoSyncService(): AutoSyncService {
  const config: AutoSyncConfig = {
    intervalMinutes: 1, // Sincronizar a cada 1 minuto
    tenants: [
      {
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
      }
    ]
  };

  return new AutoSyncService(config);
}

// 🚀 INSTÂNCIA GLOBAL PARA USO NO SISTEMA
export const globalAutoSync = createAutoSyncService();

export default AutoSyncService; 