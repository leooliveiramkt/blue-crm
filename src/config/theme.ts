
import { useEffect, useState } from 'react';
import { ThemeConfigType } from '@/types/theme';
import { defaultTheme } from './defaultTheme';
import { loadThemeFromDatabase, loadFromLocalStorage, saveThemeToStorage } from '@/utils/themeStorage';

/**
 * Hook para carregar e gerenciar as configurações de tema
 */
export const useThemeConfig = () => {
  const [themeConfig, setThemeConfig] = useState<ThemeConfigType>(defaultTheme);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadThemeConfig = async () => {
      setIsLoading(true);
      try {
        // Tentar carregar do banco de dados primeiro
        const dbTheme = await loadThemeFromDatabase();
        
        if (dbTheme) {
          setThemeConfig(dbTheme);
        } else {
          // Se não encontrou no banco, tenta o localStorage
          const localTheme = loadFromLocalStorage();
          
          if (localTheme) {
            setThemeConfig(localTheme);
          } else {
            // Se não encontrou em nenhum lugar, usa o tema padrão
            setThemeConfig(defaultTheme);
          }
        }
      } catch (error) {
        console.error('Erro ao carregar configurações do tema:', error);
        // Em caso de erro, usa o tema padrão
        setThemeConfig(defaultTheme);
      } finally {
        setIsLoading(false);
      }
    };

    loadThemeConfig();
  }, []);

  /**
   * Salva as configurações de tema
   */
  const saveThemeConfig = async (config: ThemeConfigType): Promise<boolean> => {
    try {
      // Atualiza o estado local
      setThemeConfig(config);
      
      // Persiste as configurações
      await saveThemeToStorage(config);
      
      return true;
    } catch (error) {
      console.error('Erro ao salvar configurações do tema:', error);
      return false;
    }
  };

  return {
    themeConfig,
    setThemeConfig: saveThemeConfig,
    isLoading
  };
};

/**
 * Função para unir as configurações com o tema padrão
 */
export const mergeWithDefaultTheme = (theme: Partial<ThemeConfigType>): ThemeConfigType => {
  return {
    ...defaultTheme,
    ...theme
  };
};

// Exportamos o ThemeConfig para manter compatibilidade com códigos existentes
// Isso evita ter que alterar muitos arquivos de uma só vez
export const ThemeConfig = defaultTheme;

// Função auxiliar para atualizar o tema
export const updateThemeConfig = async (config: ThemeConfigType): Promise<boolean> => {
  return await saveThemeToStorage(config);
};
