
import { wbuyConfig } from "@/config/wbuy";
import { wbuyApiCore } from "./core";

/**
 * Serviço para gerenciar configurações da Wbuy
 */
export class WbuySettingsService {
  /**
   * Busca configurações do sistema
   * @returns Configurações ou null em caso de erro
   */
  async getSettings() {
    try {
      return await wbuyApiCore.callApi(`/${wbuyConfig.endpoints.settings}`);
    } catch (error) {
      console.error('Erro ao buscar configurações:', error);
      return null;
    }
  }

  /**
   * Busca notificações
   * @param page Número da página
   * @param limit Itens por página
   * @returns Lista de notificações ou null em caso de erro
   */
  async getNotifications(page = 1, limit = 20) {
    try {
      return await wbuyApiCore.callApi(`/${wbuyConfig.endpoints.notifications}?page=${page}&limit=${limit}`);
    } catch (error) {
      console.error('Erro ao buscar notificações:', error);
      return null;
    }
  }
}

export const wbuySettingsService = new WbuySettingsService();
