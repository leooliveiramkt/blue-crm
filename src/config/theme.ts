// Theme configuration for white-labeling the app
export interface ThemeConfigType {
  // Company details
  companyName: string;
  logo?: string;
  favicon?: string;

  // Colors 
  primaryColor: string;
  primaryColorHover?: string;
  primaryForeground?: string;
  accentColor?: string;
  accentForeground?: string;
  
  // Login page
  loginBackground?: string; // URL to background image
  tagline?: string;
  description?: string;
  
  // Other UI customizations
  fontFamily?: string;
  borderRadius?: string;
}

// Default configuration
export const ThemeConfig: ThemeConfigType = {
  companyName: "Blue CRM",
  logo: "/logo.svg", // Default logo path
  
  // Cores Bela Blue conforme a paleta
  primaryColor: "#131b40", // Azul Profundo
  primaryColorHover: "#192e59", // Azul Clássico
  primaryForeground: "#ffffff", // Branco para contraste
  accentColor: "#ddcdc0", // Bege Neutro (cor da borboleta)
  
  // Login page content
  tagline: "Gerencie seus negócios com eficiência",
  description: "Plataforma completa de gestão para aumentar sua produtividade e acelerar resultados.",
  
  // Optional login background (can be a gradient or image)
  loginBackground: undefined,
};

// Function to update theme config (would be used in admin settings)
export const updateThemeConfig = (newConfig: Partial<ThemeConfigType>) => {
  // In a real implementation, this would save to backend/localStorage
  Object.assign(ThemeConfig, newConfig);
  
  // Update CSS variables based on theme config
  if (newConfig.primaryColor) {
    document.documentElement.style.setProperty('--theme-primary', newConfig.primaryColor);
  }
  
  if (newConfig.accentColor) {
    document.documentElement.style.setProperty('--theme-accent', newConfig.accentColor);
  }
};
