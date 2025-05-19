export const API_CONFIG = {
  wbuy: {
    baseUrl: import.meta.env.VITE_WBUY_API_URL,
    apiKey: import.meta.env.VITE_WBUY_API_KEY,
  },
  activeCampaign: {
    baseUrl: import.meta.env.VITE_ACTIVE_CAMPAIGN_URL,
    apiKey: import.meta.env.VITE_ACTIVE_CAMPAIGN_API_KEY,
  },
  tiny: {
    baseUrl: import.meta.env.VITE_TINY_API_URL,
    apiKey: import.meta.env.VITE_TINY_API_KEY,
  },
  googleAnalytics: {
    measurementId: import.meta.env.VITE_GA_MEASUREMENT_ID,
    apiKey: import.meta.env.VITE_GA_API_KEY,
  },
  stape: {
    baseUrl: import.meta.env.VITE_STAPE_API_URL,
    apiKey: import.meta.env.VITE_STAPE_API_KEY,
  },
  facebookAds: {
    appId: import.meta.env.VITE_FB_APP_ID,
    accessToken: import.meta.env.VITE_FB_ACCESS_TOKEN,
  }
}; 