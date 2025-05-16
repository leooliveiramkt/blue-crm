
/**
 * Tipos relacionados aos afiliados Wbuy
 */
export interface AffiliateData {
  id?: string;
  name: string;
  email: string;
  [key: string]: any;
}

export interface AffiliateFilters {
  status?: string;
  type?: string;
  [key: string]: any;
}

export interface AffiliateCommissionParams {
  affiliateId: string;
  startDate?: string;
  endDate?: string;
  page?: number;
  limit?: number;
}
