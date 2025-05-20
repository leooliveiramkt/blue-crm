-- Create wbuy_products table
CREATE TABLE IF NOT EXISTS wbuy_products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  wbuy_id TEXT NOT NULL,
  tenant_id UUID NOT NULL REFERENCES tenants(id),
  name TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL,
  stock INTEGER NOT NULL DEFAULT 0,
  status TEXT NOT NULL,
  category TEXT,
  images TEXT[] DEFAULT '{}',
  metadata JSONB DEFAULT '{}',
  last_sync_at TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create wbuy_orders table
CREATE TABLE IF NOT EXISTS wbuy_orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  wbuy_id TEXT NOT NULL,
  tenant_id UUID NOT NULL REFERENCES tenants(id),
  customer_id TEXT NOT NULL,
  status TEXT NOT NULL,
  total DECIMAL(10,2) NOT NULL,
  payment_method TEXT NOT NULL,
  shipping_address JSONB NOT NULL,
  items JSONB NOT NULL,
  metadata JSONB DEFAULT '{}',
  last_sync_at TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create wbuy_customers table
CREATE TABLE IF NOT EXISTS wbuy_customers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  wbuy_id TEXT NOT NULL,
  tenant_id UUID NOT NULL REFERENCES tenants(id),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  document TEXT,
  address JSONB,
  metadata JSONB DEFAULT '{}',
  last_sync_at TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create wbuy_stats table
CREATE TABLE IF NOT EXISTS wbuy_stats (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id UUID NOT NULL REFERENCES tenants(id),
  date DATE NOT NULL,
  total_sales DECIMAL(10,2) NOT NULL DEFAULT 0,
  total_orders INTEGER NOT NULL DEFAULT 0,
  total_customers INTEGER NOT NULL DEFAULT 0,
  top_products JSONB NOT NULL DEFAULT '[]',
  customer_acquisition JSONB NOT NULL DEFAULT '{}',
  metadata JSONB DEFAULT '{}',
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create wbuy_sync_status table
CREATE TABLE IF NOT EXISTS wbuy_sync_status (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id UUID NOT NULL REFERENCES tenants(id),
  entity_type TEXT NOT NULL,
  status TEXT NOT NULL,
  error TEXT,
  last_sync_at TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create wbuy_sync_errors table
CREATE TABLE IF NOT EXISTS wbuy_sync_errors (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id UUID NOT NULL REFERENCES tenants(id),
  entity_type TEXT NOT NULL,
  error TEXT NOT NULL,
  stack TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_wbuy_products_tenant_id ON wbuy_products(tenant_id);
CREATE INDEX IF NOT EXISTS idx_wbuy_products_wbuy_id ON wbuy_products(wbuy_id);
CREATE INDEX IF NOT EXISTS idx_wbuy_orders_tenant_id ON wbuy_orders(tenant_id);
CREATE INDEX IF NOT EXISTS idx_wbuy_orders_wbuy_id ON wbuy_orders(wbuy_id);
CREATE INDEX IF NOT EXISTS idx_wbuy_customers_tenant_id ON wbuy_customers(tenant_id);
CREATE INDEX IF NOT EXISTS idx_wbuy_customers_wbuy_id ON wbuy_customers(wbuy_id);
CREATE INDEX IF NOT EXISTS idx_wbuy_stats_tenant_id ON wbuy_stats(tenant_id);
CREATE INDEX IF NOT EXISTS idx_wbuy_stats_date ON wbuy_stats(date);
CREATE INDEX IF NOT EXISTS idx_wbuy_sync_status_tenant_id ON wbuy_sync_status(tenant_id);
CREATE INDEX IF NOT EXISTS idx_wbuy_sync_errors_tenant_id ON wbuy_sync_errors(tenant_id);

-- Create RLS policies
ALTER TABLE wbuy_products ENABLE ROW LEVEL SECURITY;
ALTER TABLE wbuy_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE wbuy_customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE wbuy_stats ENABLE ROW LEVEL SECURITY;
ALTER TABLE wbuy_sync_status ENABLE ROW LEVEL SECURITY;
ALTER TABLE wbuy_sync_errors ENABLE ROW LEVEL SECURITY;

-- Create policies for wbuy_products
CREATE POLICY "Tenants can view their own products"
  ON wbuy_products FOR SELECT
  USING (tenant_id IN (
    SELECT tenant_id FROM tenant_users WHERE user_id = auth.uid()
  ));

CREATE POLICY "Service role can manage products"
  ON wbuy_products FOR ALL
  USING (auth.role() = 'service_role');

-- Create policies for wbuy_orders
CREATE POLICY "Tenants can view their own orders"
  ON wbuy_orders FOR SELECT
  USING (tenant_id IN (
    SELECT tenant_id FROM tenant_users WHERE user_id = auth.uid()
  ));

CREATE POLICY "Service role can manage orders"
  ON wbuy_orders FOR ALL
  USING (auth.role() = 'service_role');

-- Create policies for wbuy_customers
CREATE POLICY "Tenants can view their own customers"
  ON wbuy_customers FOR SELECT
  USING (tenant_id IN (
    SELECT tenant_id FROM tenant_users WHERE user_id = auth.uid()
  ));

CREATE POLICY "Service role can manage customers"
  ON wbuy_customers FOR ALL
  USING (auth.role() = 'service_role');

-- Create policies for wbuy_stats
CREATE POLICY "Tenants can view their own stats"
  ON wbuy_stats FOR SELECT
  USING (tenant_id IN (
    SELECT tenant_id FROM tenant_users WHERE user_id = auth.uid()
  ));

CREATE POLICY "Service role can manage stats"
  ON wbuy_stats FOR ALL
  USING (auth.role() = 'service_role');

-- Create policies for wbuy_sync_status
CREATE POLICY "Tenants can view their own sync status"
  ON wbuy_sync_status FOR SELECT
  USING (tenant_id IN (
    SELECT tenant_id FROM tenant_users WHERE user_id = auth.uid()
  ));

CREATE POLICY "Service role can manage sync status"
  ON wbuy_sync_status FOR ALL
  USING (auth.role() = 'service_role');

-- Create policies for wbuy_sync_errors
CREATE POLICY "Tenants can view their own sync errors"
  ON wbuy_sync_errors FOR SELECT
  USING (tenant_id IN (
    SELECT tenant_id FROM tenant_users WHERE user_id = auth.uid()
  ));

CREATE POLICY "Service role can manage sync errors"
  ON wbuy_sync_errors FOR ALL
  USING (auth.role() = 'service_role'); 