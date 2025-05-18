import axios from 'axios';
import { API_CONFIG } from './api-config';

export async function testWbuyAPI() {
  try {
    const response = await axios.get(`${API_CONFIG.wbuy.baseUrl}/products`, {
      headers: { 'Authorization': `Bearer ${API_CONFIG.wbuy.apiKey}` }
    });
    return { success: true, data: response.data };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

export async function testActiveCampaignAPI() {
  try {
    const response = await axios.get(`${API_CONFIG.activeCampaign.baseUrl}/api/3/contacts`, {
      headers: { 'Api-Token': API_CONFIG.activeCampaign.apiKey }
    });
    return { success: true, data: response.data };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

export async function testTinyAPI() {
  try {
    const response = await axios.get(`${API_CONFIG.tiny.baseUrl}/produtos`, {
      headers: { 'apikey': API_CONFIG.tiny.apiKey }
    });
    return { success: true, data: response.data };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

export async function testGoogleAnalyticsAPI() {
  try {
    const response = await axios.get(
      `https://analyticsdata.googleapis.com/v1beta/properties/${API_CONFIG.googleAnalytics.measurementId}:runReport`,
      {
        headers: { 'Authorization': `Bearer ${API_CONFIG.googleAnalytics.apiKey}` }
      }
    );
    return { success: true, data: response.data };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

export async function testStapeAPI() {
  try {
    const response = await axios.get(`${API_CONFIG.stape.baseUrl}/api/v1/calls`, {
      headers: { 'Authorization': `Bearer ${API_CONFIG.stape.apiKey}` }
    });
    return { success: true, data: response.data };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

export async function testFacebookAdsAPI() {
  try {
    const response = await axios.get(
      `https://graph.facebook.com/v18.0/me/adaccounts`,
      {
        params: {
          access_token: API_CONFIG.facebookAds.accessToken
        }
      }
    );
    return { success: true, data: response.data };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

export async function testAllAPIs() {
  const results = {
    wbuy: await testWbuyAPI(),
    activeCampaign: await testActiveCampaignAPI(),
    tiny: await testTinyAPI(),
    googleAnalytics: await testGoogleAnalyticsAPI(),
    stape: await testStapeAPI(),
    facebookAds: await testFacebookAdsAPI()
  };

  return results;
} 