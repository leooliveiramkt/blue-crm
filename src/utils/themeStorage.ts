import { ThemeConfigType } from "@/types/theme";
import { supabase } from "@/lib/supabase";
import { getDefaultConfig } from "@/config/defaultTheme";

export const saveThemeToStorage = async (config: ThemeConfigType): Promise<boolean> => {
  try {
    // Sempre tenta salvar no Supabase, se falhar salva no localStorage
    try {
      const { error } = await supabase
        .from('theme_config')
        .insert({
          config: JSON.parse(JSON.stringify(config)),
          created_at: new Date().toISOString()
        });
      if (error) {
        console.error('Erro ao salvar configurações no Supabase:', error);
        localStorage.setItem('themeConfig', JSON.stringify(config));
      }
    } catch (e) {
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
      const themeConfig = data.config as any;
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
