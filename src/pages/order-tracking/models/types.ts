
export interface WbuyOrderData {
  orderId: string;
  customerEmail: string;
  value: number;
  date: string;
  affiliateCode: string;
  status: string;
  paymentMethod: string;
  products: string[];
  customerName: string;
  phoneNumber: string;
}

export interface ActiveCampaignData {
  contactId: string;
  email: string;
  firstSeen: string;
  utmSource: string;
  utmMedium: string;
  utmCampaign: string;
  affiliateCode: string;
  tags: string[];
  score: number;
  lastEngagement: string;
}

export interface GoogleAnalyticsData {
  sessionId: string;
  firstVisit: string;
  lastVisit: string;
  source: string;
  medium: string;
  campaign: string;
  conversionValue: number;
  device: string;
  browser: string;
  country: string;
  city: string;
}

export interface StapeData {
  eventId: string;
  firstClickTime: string;
  lastClickTime: string;
  firstClickSource: string;
  lastClickSource: string;
  affiliateParam: string;
  conversionValue: number;
  userIp: string;
  pixelId: string;
  eventSequence: string[];
}

export interface TrackingSummary {
  firstClick: string;
  lastClick: string;
  affiliateCode: string;
  confidence: number;
  matchingPlatforms: string[];
}

export interface AIAnalysisResult {
  conclusion: string;
  attribution: string;
  confidence: string;
  recommendedAction: string;
}

export interface TrackingData {
  wbuy: WbuyOrderData;
  activeCampaign: ActiveCampaignData;
  googleAnalytics: GoogleAnalyticsData;
  stape: StapeData;
  summary: TrackingSummary | null;
  aiAnalysis?: AIAnalysisResult;
}
