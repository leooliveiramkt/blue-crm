import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Integration } from '@/lib/integrations/types';

export const useAllIntegrations = () => {
  const [integrations, setIntegrations] = useState<Integration[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadIntegrations();
    // eslint-disable-next-line
  }, []);

  const loadIntegrations = async () => {
    try {
      setIsLoading(true);
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) {
        setIntegrations([]);
        return;
      }
      const { data, error } = await supabase
        .from('integrations')
        .select('*')
        .eq('user_id', user.user.id);
      if (error) {
        setIntegrations([]);
        return;
      }
      setIntegrations(data || []);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    integrations,
    isLoading,
    reload: loadIntegrations,
  };
}; 