
import { ThemeConfigType } from "@/types/theme";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";
import { getDefaultConfig } from "@/config/defaultTheme";

export const saveThemeToStorage = async (config: ThemeConfigType): Promise<boolean> => {
  try {
    if (isSupabaseConfigured) {
      // Precisamos converter ThemeConfigType para Json compatível com Supabase
      const { error } = await supabase
        .from('theme_config')
        .insert({
          config: JSON.parse(JSON.stringify(config)), // Converte para formato JSON compatível
          created_at: new Date().toISOString()
        });
        
      if (error) {
        console.error('Erro ao salvar configurações no Supabase:', error);
        localStorage.setItem('themeConfig', JSON.stringify(config));
      }
    } else {
      localStorage.setItem('themeConfig', JSON.stringify(config));
    }
    return true;
  } catch (error) {
    console.error('Erro ao salvar configurações:', error);
    return false;
  }
};

export const loadFromLocalStorage = (): ThemeConfigType | null => {
  const savedConfig = localStorage.getItem('themeConfig');
  if (savedConfig) {
    try {
      return JSON.parse(savedConfig) as ThemeConfigType;
    } catch (error) {
      console.error('Erro ao carregar configurações do localStorage:', error);
      return null;
    }
  }
  return null;
};

export const loadThemeFromDatabase = async (): Promise<ThemeConfigType | null> => {
  if (!isSupabaseConfigured) {
    return loadFromLocalStorage();
  }
  
  try {
    const { data, error } = await supabase
      .from('theme_config')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (error) {
      console.error('Erro ao carregar tema do Supabase:', error);
      return loadFromLocalStorage();
    }

    if (data && data.config) {
      // Garantimos que o retorno atende à interface ThemeConfigType
      const themeConfig = data.config as any;
      
      // Verificamos se tem campos obrigatórios
      if (typeof themeConfig.companyName === 'string' && 
          typeof themeConfig.primaryColor === 'string') {
        return themeConfig as ThemeConfigType;
      } else {
        console.warn('Tema carregado do banco não possui campos obrigatórios');
        const localTheme = loadFromLocalStorage();
        if (localTheme) return localTheme;
        return getDefaultConfig();
      }
    }

    return loadFromLocalStorage();
  } catch (error) {
    console.error('Erro ao carregar tema:', error);
    return loadFromLocalStorage();
  }
};
