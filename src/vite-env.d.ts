/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_SUPABASE_URL: string;
  readonly VITE_SUPABASE_ANON_KEY: string;
  readonly VITE_WBUY_API_URL: string;
  readonly VITE_WBUY_API_KEY: string;
  readonly VITE_FACEBOOK_API_URL: string;
  readonly VITE_FACEBOOK_API_KEY: string;
  readonly VITE_ACTIVECAMPAIGN_API_URL: string;
  readonly VITE_ACTIVECAMPAIGN_API_KEY: string;
  readonly VITE_GOOGLE_API_URL: string;
  readonly VITE_GOOGLE_API_KEY: string;
  readonly VITE_STAPE_API_URL: string;
  readonly VITE_STAPE_API_KEY: string;
  readonly VITE_TINY_API_URL: string;
  readonly VITE_TINY_API_KEY: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
