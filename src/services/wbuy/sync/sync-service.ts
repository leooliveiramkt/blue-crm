
import { WbuySyncBaseService } from './base-service';
import { WbuySyncHistoryService } from './history-service';
import { WbuySyncStatsService } from './stats-service';
import { WbuySyncOrdersService } from './orders-service';
import { OrderFilters, OrdersResult, LatestStats } from './types';

/**
 * Serviço para sincronização de dados da Wbuy
 */
export class WbuySyncService {
  private baseService: WbuySyncBaseService;
  private historyService: WbuySyncHistoryService;
  private statsService: WbuySyncStatsService;
  private ordersService: WbuySyncOrdersService;

  constructor() {
    this.baseService = new WbuySyncBaseService();
    this.historyService = new WbuySyncHistoryService();
    this.statsService = new WbuySyncStatsService();
    this.ordersService = new WbuySyncOrdersService();
  }

  // Base Service
  async startSync(fullSync: boolean = false, startDate?: string, endDate?: string) {
    return this.baseService.startSync(fullSync, startDate, endDate);
  }

  // History Service
  async getSyncStatus(syncId: string) {
    return this.historyService.getSyncStatus(syncId);
  }

  async getSyncHistory(limit: number = 10) {
    return this.historyService.getSyncHistory(limit);
  }

  async getLastSync() {
    return this.historyService.getLastSync();
  }

  // Stats Service
  async getStatsByPeriod(periodType: 'year' | 'month' | 'day') {
    return this.statsService.getStatsByPeriod(periodType);
  }

  async getLatestStats(): Promise<LatestStats> {
    return this.statsService.getLatestStats();
  }

  // Orders Service
  async getOrders(filters?: OrderFilters, page: number = 1, limit: number = 20): Promise<OrdersResult> {
    return this.ordersService.getOrders(filters, page, limit);
  }
}

export const wbuySyncService = new WbuySyncService();
