import { WBuySyncService } from './wbuySyncService';

export class WBuySyncScheduler {
  private static instance: WBuySyncScheduler;
  private syncService: WBuySyncService;
  private syncIntervals: Map<string, NodeJS.Timeout> = new Map();

  private constructor() {
    this.syncService = WBuySyncService.getInstance();
  }

  static getInstance(): WBuySyncScheduler {
    if (!WBuySyncScheduler.instance) {
      WBuySyncScheduler.instance = new WBuySyncScheduler();
    }
    return WBuySyncScheduler.instance;
  }

  async startSync(tenantId: string, intervalMinutes: number = 5) {
    // Para sincronização existente se houver
    this.stopSync(tenantId);

    // Inicia nova sincronização
    const interval = setInterval(async () => {
      try {
        await this.syncService.syncAll(tenantId);
        console.log(`Sincronização concluída para tenant ${tenantId}`);
      } catch (error) {
        console.error(`Erro na sincronização para tenant ${tenantId}:`, error);
      }
    }, intervalMinutes * 60 * 1000);

    // Executa sincronização imediata
    try {
      await this.syncService.syncAll(tenantId);
      console.log(`Sincronização inicial concluída para tenant ${tenantId}`);
    } catch (error) {
      console.error(`Erro na sincronização inicial para tenant ${tenantId}:`, error);
    }

    this.syncIntervals.set(tenantId, interval);
  }

  stopSync(tenantId: string) {
    const interval = this.syncIntervals.get(tenantId);
    if (interval) {
      clearInterval(interval);
      this.syncIntervals.delete(tenantId);
    }
  }

  stopAllSyncs() {
    for (const [tenantId, interval] of this.syncIntervals) {
      clearInterval(interval);
    }
    this.syncIntervals.clear();
  }
} 