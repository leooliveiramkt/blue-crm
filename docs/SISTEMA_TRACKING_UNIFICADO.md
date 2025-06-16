# 🎯 SISTEMA DE TRACKING UNIFICADO - BLUE CRM

## 🚀 **VISÃO ESTRATÉGICA COMPLETA**

**OBJETIVO**: Criar um CRM de Gerenciamento Total que unifica TODOS os dados da empresa, fazendo tracking interno e externo completo, com validação cruzada e otimização automática de campanhas.

## 🌐 **ARQUITETURA DO SISTEMA**

### 📊 **FONTES DE DADOS INTEGRADAS**

#### 🛡️ **DADOS ANTI-AD BLOCKER (Via Stape.io)**
```typescript
interface StapeData {
  server_side_tracking: {
    real_ip: string;
    encrypted_client_id: string;
    facebook_capi: FacebookCAPIData;
    google_enhanced: GoogleEnhancedData;
    tiktok_events: TikTokEventsData;
    geo_location: GeoLocationData;
    device_fingerprint: DeviceFingerprint;
  };
}
```

#### 🌐 **DADOS WEB TRADICIONAIS (Via GTM)**
```typescript
interface WebTrackingData {
  ga4: GA4Data;
  facebook_pixel: FacebookPixelData;
  google_ads: GoogleAdsData;
  utm_parameters: UTMData;
  user_engagement: EngagementMetrics;
}
```

### 🎯 **TRIANGULAÇÃO E VALIDAÇÃO**

#### 🔍 **MATRIX DE ATTRIBUTION COMPLETA**
```typescript
interface AttributionEngine {
  sources: {
    facebook_ads: {
      first_click: boolean;
      last_click: boolean;
      utm_campaign: string;
      ad_id: string;
      pixel_confirmed: boolean;
      capi_confirmed: boolean;
    };
    
    google_ads: {
      first_click: boolean;
      last_click: boolean;
      gclid: string;
      keyword: string;
      server_side_confirmed: boolean;
    };
    
    affiliates: {
      ref_code: string; // ?ref=AFILIADO123
      affiliate_id: string;
      commission_rate: number;
      wbuy_validated: boolean;
      first_click: boolean;
      last_click: boolean;
    };
    
    influencers: {
      instagram_bio: boolean;
      story_link: boolean;
      influencer_code: string;
      utm_source: 'instagram';
    };
    
    organic_seo: {
      keyword: string;
      search_engine: string;
      landing_page: string;
    };
    
    direct_traffic: {
      type_in: boolean;
      bookmark: boolean;
      no_referrer: boolean;
    };
  };
  
  validation: {
    accuracy_score: number; // 0-100%
    confidence_level: 'high' | 'medium' | 'low';
    cross_validation: boolean;
  };
}
```

### 💰 **AUDITORIA DE COMISSÕES WBUY**

#### 🔍 **SISTEMA DE VALIDAÇÃO AUTOMÁTICA**
```typescript
interface CommissionAuditSystem {
  sale_tracking: {
    order_id: string;
    sale_value: number;
    commission_calculated: number;
    commission_wbuy_paid: number;
    discrepancy: number;
    affiliate_ref: string;
  };
  
  evidence_collection: {
    ga4_conversion: boolean;
    stape_confirmation: boolean;
    activecampaign_tag: boolean;
    utm_validation: boolean;
    pixel_firing: boolean;
    server_side_validation: boolean;
  };
  
  audit_result: {
    commission_correct: boolean;
    discrepancy_amount: number;
    confidence_score: number;
    recommended_action: string;
  };
}
```

### 🔄 **OTIMIZAÇÃO AUTOMÁTICA DE CAMPANHAS**

#### 📈 **FEEDBACK PARA PLATAFORMAS**
```typescript
interface CampaignOptimizer {
  facebook_capi_optimization: {
    conversion_events: ConversionEvent[];
    audience_insights: AudienceData;
    creative_performance: CreativeMetrics;
    bid_optimization: BidStrategy;
  };
  
  google_ads_optimization: {
    conversion_import: GoogleConversion[];
    audience_signals: AudienceSignals;
    keyword_performance: KeywordMetrics;
    smart_bidding_data: SmartBiddingData;
  };
  
  budget_allocation: {
    facebook_roi: number;
    google_roi: number;
    affiliate_roi: number;
    recommended_budget_shift: BudgetAllocation;
  };
}
```

## 🗄️ **ESTRUTURA DO SUPABASE**

### 📊 **TABELA PRINCIPAL: unified_tracking_events**
```sql
CREATE TABLE unified_tracking_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id VARCHAR NOT NULL,
  event_timestamp TIMESTAMPTZ NOT NULL,
  event_type VARCHAR NOT NULL, -- view_item, purchase, add_to_cart, etc
  
  -- Identificadores únicos
  client_id_web VARCHAR,
  client_id_server VARCHAR,
  session_id VARCHAR,
  user_id VARCHAR,
  
  -- UTMs e Attribution
  utm_source VARCHAR,
  utm_medium VARCHAR,
  utm_campaign VARCHAR,
  utm_content VARCHAR,
  utm_term VARCHAR,
  ref_code VARCHAR, -- Código de afiliado
  gclid VARCHAR, -- Google Click ID
  fbclid VARCHAR, -- Facebook Click ID
  
  -- Dados de conversão
  conversion_value DECIMAL,
  currency VARCHAR DEFAULT 'BRL',
  product_id VARCHAR,
  order_id VARCHAR,
  quantity INTEGER,
  
  -- Attribution tracking
  first_click_source VARCHAR,
  first_click_medium VARCHAR,
  first_click_campaign VARCHAR,
  first_click_timestamp TIMESTAMPTZ,
  
  last_click_source VARCHAR,
  last_click_medium VARCHAR,
  last_click_campaign VARCHAR,
  last_click_timestamp TIMESTAMPTZ,
  
  -- Validação cruzada
  ga4_validated BOOLEAN DEFAULT FALSE,
  stape_validated BOOLEAN DEFAULT FALSE,
  wbuy_validated BOOLEAN DEFAULT FALSE,
  activecampaign_validated BOOLEAN DEFAULT FALSE,
  facebook_capi_validated BOOLEAN DEFAULT FALSE,
  google_server_validated BOOLEAN DEFAULT FALSE,
  
  -- Dados técnicos
  ip_address INET,
  user_agent TEXT,
  geo_country VARCHAR,
  geo_region VARCHAR,
  geo_city VARCHAR,
  device_type VARCHAR,
  browser VARCHAR,
  os VARCHAR,
  
  -- Dados brutos para auditoria
  ga4_raw_data JSONB,
  stape_raw_data JSONB,
  wbuy_raw_data JSONB,
  facebook_raw_data JSONB,
  google_raw_data JSONB,
  
  -- Metadados
  accuracy_score INTEGER, -- 0-100
  confidence_level VARCHAR,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

### 💰 **TABELA DE AUDITORIA: commission_audit**
```sql
CREATE TABLE commission_audit (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id VARCHAR NOT NULL,
  order_id VARCHAR NOT NULL,
  affiliate_ref VARCHAR NOT NULL,
  
  -- Valores financeiros
  sale_value DECIMAL NOT NULL,
  commission_rate DECIMAL NOT NULL,
  commission_calculated DECIMAL NOT NULL,
  commission_wbuy_reported DECIMAL,
  commission_wbuy_paid DECIMAL,
  
  -- Discrepâncias
  discrepancy_reported DECIMAL GENERATED ALWAYS AS (commission_calculated - COALESCE(commission_wbuy_reported, 0)) STORED,
  discrepancy_paid DECIMAL GENERATED ALWAYS AS (commission_calculated - COALESCE(commission_wbuy_paid, 0)) STORED,
  
  -- Attribution
  attribution_source VARCHAR NOT NULL,
  first_click_source VARCHAR,
  last_click_source VARCHAR,
  attribution_window_days INTEGER DEFAULT 30,
  
  -- Validação
  validation_score INTEGER, -- 0-100
  validation_evidence JSONB,
  
  -- Status
  audit_status VARCHAR DEFAULT 'pending', -- pending, validated, discrepancy_found, resolved
  resolution_notes TEXT,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  resolved_at TIMESTAMPTZ
);
```

### 📈 **TABELA DE PERFORMANCE: campaign_performance**
```sql
CREATE TABLE campaign_performance_daily (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id VARCHAR NOT NULL,
  performance_date DATE NOT NULL,
  
  -- Identificação da campanha
  traffic_source VARCHAR NOT NULL, -- facebook, google, affiliate, influencer, organic, direct
  campaign_name VARCHAR,
  ad_set_name VARCHAR,
  ad_name VARCHAR,
  
  -- Métricas básicas
  impressions INTEGER DEFAULT 0,
  clicks INTEGER DEFAULT 0,
  cost DECIMAL DEFAULT 0,
  conversions INTEGER DEFAULT 0,
  conversion_value DECIMAL DEFAULT 0,
  
  -- Métricas calculadas
  ctr DECIMAL GENERATED ALWAYS AS (CASE WHEN impressions > 0 THEN (clicks::DECIMAL / impressions) * 100 ELSE 0 END) STORED,
  cpc DECIMAL GENERATED ALWAYS AS (CASE WHEN clicks > 0 THEN cost / clicks ELSE 0 END) STORED,
  cpa DECIMAL GENERATED ALWAYS AS (CASE WHEN conversions > 0 THEN cost / conversions ELSE 0 END) STORED,
  roas DECIMAL GENERATED ALWAYS AS (CASE WHEN cost > 0 THEN conversion_value / cost ELSE 0 END) STORED,
  
  -- Dados da plataforma
  platform_campaign_id VARCHAR,
  platform_ad_set_id VARCHAR,
  platform_ad_id VARCHAR,
  platform_raw_data JSONB,
  
  -- Metadados
  data_source VARCHAR NOT NULL, -- api, manual, estimated
  last_sync TIMESTAMPTZ DEFAULT NOW(),
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(tenant_id, performance_date, traffic_source, campaign_name, ad_set_name, ad_name)
);
```

## 🎯 **BENEFÍCIOS ESTRATÉGICOS**

### 🚀 **PARA O NEGÓCIO**
- ✅ **Visibilidade 100%**: Nenhuma conversão perdida por ad blockers
- ✅ **Auditoria Automática**: Validação de comissões WBuy em tempo real
- ✅ **Attribution Precisa**: First-click e last-click com validação cruzada
- ✅ **ROI Real**: Conhecimento exato do retorno por canal
- ✅ **Detecção de Fraudes**: Identifica tráfego falso automaticamente

### 📈 **PARA MARKETING**
- ✅ **Otimização Automática**: Campanhas se ajustam sozinhas
- ✅ **Budget Allocation**: Investe onde realmente converte
- ✅ **Audiências Qualificadas**: Dados precisos para lookalike
- ✅ **Creative Insights**: Sabe qual criativo converte mais
- ✅ **Cross-Platform**: Visão unificada de todos os canais

### 🏆 **PARA AFILIADOS**
- ✅ **Transparência Total**: Acesso aos dados reais de performance
- ✅ **Comissões Corretas**: Sistema audita automaticamente
- ✅ **Performance Detalhada**: Métricas granulares por afiliado
- ✅ **Attribution Justa**: First vs last click transparente

## 📋 **ROADMAP DE IMPLEMENTAÇÃO**

### 🚀 **SPRINT 1: FUNDAÇÃO (1-2 semanas)**
1. ✅ Configuração final da API Stape.io
2. ✅ Criação das tabelas no Supabase
3. ✅ Serviço de coleta unificada de dados
4. ✅ Sistema básico de triangulação

### 🚀 **SPRINT 2: ATTRIBUTION (1-2 semanas)**
1. ✅ Engine de first-click / last-click attribution
2. ✅ Validação cruzada entre fontes
3. ✅ Dashboard de attribution
4. ✅ Alertas para discrepâncias

### 🚀 **SPRINT 3: AUDITORIA (1-2 semanas)**
1. ✅ Sistema de auditoria de comissões WBuy
2. ✅ Detecção automática de discrepâncias
3. ✅ Relatórios de auditoria
4. ✅ Interface para resolução de conflitos

### 🚀 **SPRINT 4: OTIMIZAÇÃO (1-2 semanas)**
1. ✅ Feedback automático para Facebook CAPI
2. ✅ Integração com Google Ads API
3. ✅ Sistema de scores de qualidade
4. ✅ Otimização de budget allocation

### 🚀 **SPRINT 5: INTELIGÊNCIA (1-2 semanas)**
1. ✅ IA para predição de LTV
2. ✅ Detecção automática de fraudes
3. ✅ Otimização preditiva de campanhas
4. ✅ Relatórios executivos automatizados

---

> **🔥 RESULTADO**: Um sistema que não apenas coleta dados, mas que **ativamente otimiza o negócio**, **detecta problemas** e **maximiza resultados** 24/7!

Este é o futuro do e-commerce: dados 100% confiáveis + IA + otimização automática = **DOMÍNIO TOTAL DO MERCADO**! 🚀💰🎯 