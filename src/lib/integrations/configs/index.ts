
import { IntegrationConfig, IntegrationType } from '../types';
import { wbuyConfig } from './wbuy';
import { facebookConfig } from './facebook';
import { activecampaignConfig } from './activecampaign';
import { googleConfig } from './google';
import { stapeConfig } from './stape';
import { tinyConfig } from './tiny';
import { airtableConfig } from './airtable';

/**
 * Configurações para cada tipo de integração suportada
 */
export const integrationConfigs: Record<IntegrationType, IntegrationConfig> = {
  wbuy: wbuyConfig,
  facebook: facebookConfig,
  activecampaign: activecampaignConfig,
  google: googleConfig,
  stape: stapeConfig,
  tiny: tinyConfig,
  airtable: airtableConfig
};

/**
 * Obtém a configuração de uma integração específica
 */
export const getIntegrationConfig = (integrationId: IntegrationType): IntegrationConfig | null => {
  return integrationConfigs[integrationId] || null;
};

/**
 * Lista todas as integrações disponíveis
 */
export const getAllIntegrationConfigs = (): IntegrationConfig[] => {
  return Object.values(integrationConfigs);
};
