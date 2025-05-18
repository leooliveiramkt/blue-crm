
import { wbuyConfig } from "@/config/wbuy";
import { wbuyApiCore } from "./core";

/**
 * Serviço para gerenciar usuários da Wbuy
 */
export class WbuyUsersService {
  /**
   * Busca lista de usuários
   * @param page Número da página
   * @param limit Itens por página
   * @returns Lista de usuários ou null em caso de erro
   */
  async getUsers(page = 1, limit = 20) {
    try {
      return await wbuyApiCore.callApi(`/${wbuyConfig.endpoints.users}?page=${page}&limit=${limit}`);
    } catch (error) {
      console.error('Erro ao buscar usuários:', error);
      return null;
    }
  }

  /**
   * Busca detalhes de um usuário específico
   * @param userId ID do usuário
   * @returns Detalhes do usuário ou null em caso de erro
   */
  async getUserDetails(userId: string) {
    try {
      return await wbuyApiCore.callApi(`/${wbuyConfig.endpoints.user_detail}/${userId}`);
    } catch (error) {
      console.error('Erro ao buscar detalhes do usuário:', error);
      return null;
    }
  }
}

export const wbuyUsersService = new WbuyUsersService();
