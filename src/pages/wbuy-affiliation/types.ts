
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
