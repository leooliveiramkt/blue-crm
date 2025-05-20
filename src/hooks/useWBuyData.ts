import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

export function useWBuyProducts(tenantId: string) {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data, error } = await supabase
          .from('wbuy_products')
          .select('*')
          .eq('tenant_id', tenantId)
          .order('created_at', { ascending: false });

        if (error) throw error;
        setProducts(data || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();

    // Inscreve para atualizações em tempo real
    const subscription = supabase
      .from('wbuy_products')
      .on('*', (payload) => {
        if (payload.new.tenant_id === tenantId) {
          setProducts(prev => {
            const index = prev.findIndex(p => p.id === payload.new.id);
            if (index >= 0) {
              const updated = [...prev];
              updated[index] = payload.new;
              return updated;
            }
            return [payload.new, ...prev];
          });
        }
      })
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [tenantId]);

  return { products, loading, error };
}

export function useWBuyOrders(tenantId: string) {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const { data, error } = await supabase
          .from('wbuy_orders')
          .select('*')
          .eq('tenant_id', tenantId)
          .order('created_at', { ascending: false });

        if (error) throw error;
        setOrders(data || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();

    // Inscreve para atualizações em tempo real
    const subscription = supabase
      .from('wbuy_orders')
      .on('*', (payload) => {
        if (payload.new.tenant_id === tenantId) {
          setOrders(prev => {
            const index = prev.findIndex(o => o.id === payload.new.id);
            if (index >= 0) {
              const updated = [...prev];
              updated[index] = payload.new;
              return updated;
            }
            return [payload.new, ...prev];
          });
        }
      })
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [tenantId]);

  return { orders, loading, error };
}

export function useWBuyCustomers(tenantId: string) {
  const [customers, setCustomers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const { data, error } = await supabase
          .from('wbuy_customers')
          .select('*')
          .eq('tenant_id', tenantId)
          .order('created_at', { ascending: false });

        if (error) throw error;
        setCustomers(data || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCustomers();

    // Inscreve para atualizações em tempo real
    const subscription = supabase
      .from('wbuy_customers')
      .on('*', (payload) => {
        if (payload.new.tenant_id === tenantId) {
          setCustomers(prev => {
            const index = prev.findIndex(c => c.id === payload.new.id);
            if (index >= 0) {
              const updated = [...prev];
              updated[index] = payload.new;
              return updated;
            }
            return [payload.new, ...prev];
          });
        }
      })
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [tenantId]);

  return { customers, loading, error };
}

export function useWBuyStats(tenantId: string) {
  const [stats, setStats] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const today = new Date().toISOString().split('T')[0];
        const { data, error } = await supabase
          .from('wbuy_stats')
          .select('*')
          .eq('tenant_id', tenantId)
          .eq('date', today)
          .single();

        if (error) throw error;
        setStats(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();

    // Inscreve para atualizações em tempo real
    const subscription = supabase
      .from('wbuy_stats')
      .on('*', (payload) => {
        if (payload.new.tenant_id === tenantId) {
          setStats(payload.new);
        }
      })
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [tenantId]);

  return { stats, loading, error };
} 