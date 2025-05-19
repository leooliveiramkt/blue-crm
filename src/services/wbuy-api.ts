
// Este arquivo agora atua como uma camada de compatibilidade com código existente
// Exporta uma classe WbuyApiService que internamente usa os novos serviços modularizados

import {
  wbuyApiCore,
  wbuyProductsService,
  wbuyOrdersService,
  wbuyAffiliatesService,
  wbuyLeadsService,
  wbuyUsersService,
  wbuyReportsService,
  wbuySettingsService
} from './wbuy';

/**
 * Gerencia as chamadas à API da Wbuy
 * @deprecated Use os serviços específicos em src/services/wbuy/
 */
export class WbuyApiService {
  /**
   * Obtém as credenciais de integração Wbuy do tenant atual
   * @returns Credenciais da API Wbuy ou credenciais padrão
   */
  async getCredentials() {
    return wbuyApiCore.getCredentials();
  }

  /**
   * Faz uma chamada à API Wbuy
   * @param endpoint Endpoint da API (ex: /orders, /affiliates)
   * @param method Método HTTP
   * @param body Corpo da requisição (opcional)
   * @returns Dados da resposta ou null em caso de erro
   */
  async callApi<T>(endpoint: string, method: 'GET' | 'POST' | 'PUT' | 'DELETE' = 'GET', body?: any) {
    return wbuyApiCore.callApi<T>(endpoint, method, body);
  }

  // ====== PRODUTOS ======
  async getProducts(page = 1, limit = 20, filters?: Record<string, any>) {
    return wbuyProductsService.getProducts(page, limit, filters);
  }

  async getProductDetails(productId: string) {
    return wbuyProductsService.getProductDetails(productId);
  }

  async getCategories() {
    return wbuyProductsService.getCategories();
  }

  // ====== PEDIDOS ======
  async getOrderData(orderCode: string) {
    return wbuyOrdersService.getOrderData(orderCode);
  }

  async getOrders(page = 1, limit = 20, filters?: Record<string, any>) {
    return wbuyOrdersService.getOrders(page, limit, filters);
  }

  async createOrder(orderData: any) {
    return wbuyOrdersService.createOrder(orderData);
  }

  async updateOrder(orderId: string, orderData: any) {
    return wbuyOrdersService.updateOrder(orderId, orderData);
  }

  // ====== AFILIADOS ======
  async getAffiliates(searchTerm?: string, page = 1, limit = 20, filters?: Record<string, any>) {
    return wbuyAffiliatesService.getAffiliates(searchTerm, page, limit, filters);
  }

  async getAffiliateDetails(affiliateId: string) {
    return wbuyAffiliatesService.getAffiliateDetails(affiliateId);
  }

  async createAffiliate(affiliateData: any) {
    return wbuyAffiliatesService.createAffiliate(affiliateData);
  }

  async updateAffiliate(affiliateId: string, affiliateData: any) {
    return wbuyAffiliatesService.updateAffiliate(affiliateId, affiliateData);
  }

  async updateAffiliateAttribute(affiliateId: string, attributeName: string, attributeValue: string) {
    return wbuyAffiliatesService.updateAffiliateAttribute(affiliateId, attributeName, attributeValue);
  }

  async getAffiliateCommissions(affiliateId: string, startDate?: string, endDate?: string) {
    return wbuyAffiliatesService.getAffiliateCommissions(affiliateId, startDate, endDate);
  }

  // ====== LEADS ======
  async getLeads(page = 1, limit = 20, filters?: Record<string, any>) {
    return wbuyLeadsService.getLeads(page, limit, filters);
  }

  async getLeadDetails(leadId: string) {
    return wbuyLeadsService.getLeadDetails(leadId);
  }

  async createLead(leadData: any) {
    return wbuyLeadsService.createLead(leadData);
  }

  async updateLead(leadId: string, leadData: any) {
    return wbuyLeadsService.updateLead(leadId, leadData);
  }

  // ====== USUÁRIOS ======
  async getUsers(page = 1, limit = 20) {
    return wbuyUsersService.getUsers(page, limit);
  }

  async getUserDetails(userId: string) {
    return wbuyUsersService.getUserDetails(userId);
  }

  // ====== RELATÓRIOS ======
  async getSalesReport(startDate: string, endDate: string, filters?: Record<string, any>) {
    return wbuyReportsService.getSalesReport(startDate, endDate, filters);
  }

  async getAffiliatesReport(startDate: string, endDate: string, filters?: Record<string, any>) {
    return wbuyReportsService.getAffiliatesReport(startDate, endDate, filters);
  }

  // ====== CONFIGURAÇÕES ======
  async getSettings() {
    return wbuySettingsService.getSettings();
  }

  // ====== NOTIFICAÇÕES ======
  async getNotifications(page = 1, limit = 20) {
    return wbuySettingsService.getNotifications(page, limit);
  }
}

export const wbuyApiService = new WbuyApiService();
