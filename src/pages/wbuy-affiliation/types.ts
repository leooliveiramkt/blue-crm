
export interface Affiliate {
  id: string;
  name: string;
  email: string;
  document: string;
  status: string;
  attributes: AffiliateAttribute[];
}

export interface AffiliateAttribute {
  id: string;
  name: string;
  value: string;
}

export interface RankingItem {
  affiliate_id: string;
  full_name: string;
  total_sales: number;
  total_sale_amount: number;
  total_commission: number;
  product_type: string; // Garantindo que product_type é obrigatório
}
