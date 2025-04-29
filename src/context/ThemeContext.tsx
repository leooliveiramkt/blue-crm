
import React, { createContext, useContext, ReactNode } from 'react';
import { ThemeConfigType } from '@/types/theme';
import { useThemeConfig } from '@/config/theme';

interface ThemeContextType {
  themeConfig: ThemeConfigType;
  setThemeConfig: (config: ThemeConfigType) => Promise<boolean>;
  isLoading: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { themeConfig, setThemeConfig, isLoading } = useThemeConfig();

  return (
    <ThemeContext.Provider value={{ themeConfig, setThemeConfig, isLoading }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

// Para compatibilidade com código existente
export { ThemeContext };
