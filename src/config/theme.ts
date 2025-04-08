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
  philosophicalQuote?: string; // Citação filosófica
  
  // Other UI customizations
  fontFamily?: string;
  borderRadius?: string;
}

// Default configuration
export const ThemeConfig: ThemeConfigType = {
  companyName: "Blue CRM",
  logo: "/logo.svg", // Default logo path
  favicon: "/favicon.svg", // Favicon path
  
  // Cores ajustadas conforme a nova paleta da Blue
  primaryColor: "#001440", // Azul marinho profundo (da imagem)
  primaryColorHover: "#00215e", // Uma versão mais clara para hover
  primaryForeground: "#ffffff", // Branco para contraste
  accentColor: "#ddcdc0", // Bege da borboleta
  
  // Login page content
  tagline: "Gerencie seus negócios com eficiência",
  description: "Plataforma completa de gestão para aumentar sua produtividade e acelerar resultados.",
  
  // Citação filosófica sobre conhecimento
  philosophicalQuote: "O conhecimento é o único bem que se multiplica quando compartilhado. — Francis Bacon",
  
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
  
  // Atualizar favicon dinamicamente
  if (newConfig.logo) {
    const faviconLink = document.querySelector("link[rel~='icon']");
    if (faviconLink) {
      // Converte logo para favicon
      const faviconUrl = createFaviconFromLogo(newConfig.logo);
      (faviconLink as HTMLLinkElement).href = faviconUrl;
    }
  }
};

// Função para converter logo em favicon
export const createFaviconFromLogo = (logoUrl: string): string => {
  // Cria um canvas para redimensionar a imagem
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  canvas.width = 48;
  canvas.height = 48;

  return new Promise<string>((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'Anonymous';
    img.onload = () => {
      // Redimensiona e centraliza a imagem
      ctx?.drawImage(
        img, 
        0, 0, img.width, img.height, // source rectangle
        0, 0, 48, 48 // destination rectangle
      );
      resolve(canvas.toDataURL('image/png'));
    };
    img.onerror = reject;
    img.src = logoUrl;
  });
};
