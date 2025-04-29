
import { ThemeConfigType } from "@/types/theme";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";

export const saveThemeToStorage = async (config: ThemeConfigType): Promise<boolean> => {
  try {
    if (isSupabaseConfigured) {
      const { error } = await supabase
        .from('theme_config')
        .insert({
          config: config,
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
      return JSON.parse(savedConfig);
    } catch (error) {
      console.error('Erro ao carregar configurações do localStorage:', error);
      return null;
    }
  }
  return null;
};
