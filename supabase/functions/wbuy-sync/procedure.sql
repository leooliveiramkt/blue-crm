
-- Função para gerar estatísticas por período
-- Esta função precisa ser executada no Supabase SQL Editor
CREATE OR REPLACE FUNCTION public.generate_wbuy_stats(
  period_type TEXT,
  limit_days INT DEFAULT NULL
)
RETURNS SETOF wbuy_stats
LANGUAGE plpgsql
AS $$
DECLARE
  rec RECORD;
  period_value TEXT;
  period_start TIMESTAMP WITH TIME ZONE;
  period_end TIMESTAMP WITH TIME ZONE;
  product_dist JSONB;
  payment_dist JSONB;
  affiliate_dist JSONB;
  total_orders INT;
  total_revenue NUMERIC;
  total_affiliates INT;
  stats_id UUID;
BEGIN
  -- Para estatísticas diárias, podemos limitar o número de dias para processamento
  IF period_type = 'day' AND limit_days IS NOT NULL THEN
    FOR rec IN
      SELECT 
        date_trunc('day', order_date)::date AS period_date
      FROM 
        wbuy_orders
      WHERE 
        order_date >= (CURRENT_DATE - (limit_days || ' days')::INTERVAL)
      GROUP BY 
        period_date
      ORDER BY 
        period_date
    LOOP
      period_value := rec.period_date::TEXT;
      period_start := (rec.period_date || ' 00:00:00')::TIMESTAMP WITH TIME ZONE;
      period_end := (rec.period_date || ' 23:59:59')::TIMESTAMP WITH TIME ZONE;
      
      -- Calcular estatísticas para o dia
      SELECT 
        COUNT(*) AS order_count,
        COALESCE(SUM(value), 0) AS revenue,
        COUNT(DISTINCT affiliate_code) AS affiliate_count
      INTO
        total_orders, total_revenue, total_affiliates
      FROM 
        wbuy_orders
      WHERE 
        order_date BETWEEN period_start AND period_end;
      
      -- Distribuição de produtos
      SELECT 
        jsonb_object_agg(
          COALESCE(p->>'name', 'Desconhecido'), 
          COUNT(*)
        ) AS dist
      INTO 
        product_dist
      FROM 
        wbuy_orders,
        jsonb_array_elements(products) AS p
      WHERE 
        order_date BETWEEN period_start AND period_end;
      
      -- Distribuição de métodos de pagamento
      SELECT 
        jsonb_object_agg(
          COALESCE(payment_method, 'Desconhecido'), 
          COUNT(*)
        ) AS dist
      INTO 
        payment_dist
      FROM 
        wbuy_orders
      WHERE 
        order_date BETWEEN period_start AND period_end
      GROUP BY 
        payment_method;
      
      -- Distribuição de afiliados
      SELECT 
        jsonb_object_agg(
          COALESCE(affiliate_code, 'Direto'), 
          COUNT(*)
        ) AS dist
      INTO 
        affiliate_dist
      FROM 
        wbuy_orders
      WHERE 
        order_date BETWEEN period_start AND period_end
      GROUP BY 
        affiliate_code;
      
      -- Insere ou atualiza as estatísticas
      INSERT INTO wbuy_stats (
        period_type,
        period_value,
        total_orders,
        total_revenue,
        total_affiliates,
        product_distribution,
        payment_methods_distribution,
        affiliate_distribution
      ) VALUES (
        period_type,
        period_value,
        total_orders,
        total_revenue,
        total_affiliates,
        product_dist,
        payment_dist,
        affiliate_dist
      ) ON CONFLICT (period_type, period_value) DO UPDATE SET
        total_orders = EXCLUDED.total_orders,
        total_revenue = EXCLUDED.total_revenue,
        total_affiliates = EXCLUDED.total_affiliates,
        product_distribution = EXCLUDED.product_distribution,
        payment_methods_distribution = EXCLUDED.payment_methods_distribution,
        affiliate_distribution = EXCLUDED.affiliate_distribution,
        updated_at = now()
      RETURNING * INTO rec;
      
      RETURN NEXT rec;
    END LOOP;
    
  -- Estatísticas mensais
  ELSIF period_type = 'month' THEN
    FOR rec IN
      SELECT 
        DISTINCT (year || '-' || LPAD(month::TEXT, 2, '0')) AS period_month,
        year,
        month
      FROM 
        wbuy_orders
      ORDER BY 
        year, month
    LOOP
      period_value := rec.period_month;
      period_start := (rec.period_month || '-01')::DATE;
      period_end := (DATE_TRUNC('month', period_start) + INTERVAL '1 month - 1 day')::DATE;
      
      -- Calcular estatísticas para o mês
      SELECT 
        COUNT(*) AS order_count,
        COALESCE(SUM(value), 0) AS revenue,
        COUNT(DISTINCT affiliate_code) AS affiliate_count
      INTO
        total_orders, total_revenue, total_affiliates
      FROM 
        wbuy_orders
      WHERE 
        year = rec.year AND month = rec.month;
      
      -- Distribuição de produtos
      SELECT 
        jsonb_object_agg(
          COALESCE(p->>'name', 'Desconhecido'), 
          COUNT(*)
        ) AS dist
      INTO 
        product_dist
      FROM 
        wbuy_orders,
        jsonb_array_elements(products) AS p
      WHERE 
        year = rec.year AND month = rec.month;
      
      -- Distribuição de métodos de pagamento
      SELECT 
        jsonb_object_agg(
          COALESCE(payment_method, 'Desconhecido'), 
          COUNT(*)
        ) AS dist
      INTO 
        payment_dist
      FROM 
        wbuy_orders
      WHERE 
        year = rec.year AND month = rec.month
      GROUP BY 
        payment_method;
      
      -- Distribuição de afiliados
      SELECT 
        jsonb_object_agg(
          COALESCE(affiliate_code, 'Direto'), 
          COUNT(*)
        ) AS dist
      INTO 
        affiliate_dist
      FROM 
        wbuy_orders
      WHERE 
        year = rec.year AND month = rec.month
      GROUP BY 
        affiliate_code;
      
      -- Insere ou atualiza as estatísticas
      INSERT INTO wbuy_stats (
        period_type,
        period_value,
        total_orders,
        total_revenue,
        total_affiliates,
        product_distribution,
        payment_methods_distribution,
        affiliate_distribution
      ) VALUES (
        period_type,
        period_value,
        total_orders,
        total_revenue,
        total_affiliates,
        product_dist,
        payment_dist,
        affiliate_dist
      ) ON CONFLICT (period_type, period_value) DO UPDATE SET
        total_orders = EXCLUDED.total_orders,
        total_revenue = EXCLUDED.total_revenue,
        total_affiliates = EXCLUDED.total_affiliates,
        product_distribution = EXCLUDED.product_distribution,
        payment_methods_distribution = EXCLUDED.payment_methods_distribution,
        affiliate_distribution = EXCLUDED.affiliate_distribution,
        updated_at = now()
      RETURNING * INTO rec;
      
      RETURN NEXT rec;
    END LOOP;
    
  -- Estatísticas anuais
  ELSIF period_type = 'year' THEN
    FOR rec IN
      SELECT 
        DISTINCT year
      FROM 
        wbuy_orders
      ORDER BY 
        year
    LOOP
      period_value := rec.year::TEXT;
      period_start := (rec.year || '-01-01')::DATE;
      period_end := (rec.year || '-12-31')::DATE;
      
      -- Calcular estatísticas para o ano
      SELECT 
        COUNT(*) AS order_count,
        COALESCE(SUM(value), 0) AS revenue,
        COUNT(DISTINCT affiliate_code) AS affiliate_count
      INTO
        total_orders, total_revenue, total_affiliates
      FROM 
        wbuy_orders
      WHERE 
        year = rec.year;
      
      -- Distribuição de produtos
      SELECT 
        jsonb_object_agg(
          COALESCE(p->>'name', 'Desconhecido'), 
          COUNT(*)
        ) AS dist
      INTO 
        product_dist
      FROM 
        wbuy_orders,
        jsonb_array_elements(products) AS p
      WHERE 
        year = rec.year;
      
      -- Distribuição de métodos de pagamento
      SELECT 
        jsonb_object_agg(
          COALESCE(payment_method, 'Desconhecido'), 
          COUNT(*)
        ) AS dist
      INTO 
        payment_dist
      FROM 
        wbuy_orders
      WHERE 
        year = rec.year
      GROUP BY 
        payment_method;
      
      -- Distribuição de afiliados
      SELECT 
        jsonb_object_agg(
          COALESCE(affiliate_code, 'Direto'), 
          COUNT(*)
        ) AS dist
      INTO 
        affiliate_dist
      FROM 
        wbuy_orders
      WHERE 
        year = rec.year
      GROUP BY 
        affiliate_code;
      
      -- Insere ou atualiza as estatísticas
      INSERT INTO wbuy_stats (
        period_type,
        period_value,
        total_orders,
        total_revenue,
        total_affiliates,
        product_distribution,
        payment_methods_distribution,
        affiliate_distribution
      ) VALUES (
        period_type,
        period_value,
        total_orders,
        total_revenue,
        total_affiliates,
        product_dist,
        payment_dist,
        affiliate_dist
      ) ON CONFLICT (period_type, period_value) DO UPDATE SET
        total_orders = EXCLUDED.total_orders,
        total_revenue = EXCLUDED.total_revenue,
        total_affiliates = EXCLUDED.total_affiliates,
        product_distribution = EXCLUDED.product_distribution,
        payment_methods_distribution = EXCLUDED.payment_methods_distribution,
        affiliate_distribution = EXCLUDED.affiliate_distribution,
        updated_at = now()
      RETURNING * INTO rec;
      
      RETURN NEXT rec;
    END LOOP;
  END IF;
  
  RETURN;
END;
$$;
