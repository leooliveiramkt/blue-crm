
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

// Carrega as configurações do localStorage, se disponíveis
const loadSavedThemeConfig = (): ThemeConfigType => {
  const savedConfig = localStorage.getItem('themeConfig');
  if (savedConfig) {
    try {
      return JSON.parse(savedConfig);
    } catch (error) {
      console.error('Erro ao carregar configurações do tema:', error);
    }
  }
  
  // Retorna as configurações padrão se não houver configurações salvas
  return {
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
};

// Default configuration
export const ThemeConfig: ThemeConfigType = loadSavedThemeConfig();

// Aplica as configurações do tema às variáveis CSS ao carregar
const applyThemeToDOM = () => {
  // Atualiza as variáveis CSS com base na configuração atual
  if (ThemeConfig.primaryColor) {
    document.documentElement.style.setProperty('--theme-primary', ThemeConfig.primaryColor);
  }
  
  if (ThemeConfig.accentColor) {
    document.documentElement.style.setProperty('--theme-accent', ThemeConfig.accentColor);
  }
  
  // Atualiza o favicon
  if (ThemeConfig.logo) {
    const faviconLink = document.querySelector("link[rel~='icon']");
    if (faviconLink) {
      createFaviconFromLogo(ThemeConfig.logo)
        .then(faviconUrl => {
          (faviconLink as HTMLLinkElement).href = faviconUrl;
        })
        .catch(error => {
          console.error("Erro ao converter logo para favicon:", error);
        });
    }
  }
  
  // Atualiza o título da página
  if (ThemeConfig.companyName) {
    document.title = ThemeConfig.companyName;
  }
};

// Aplica tema ao carregar a página
if (typeof window !== 'undefined') {
  // Executa apenas no cliente, não durante SSR
  setTimeout(applyThemeToDOM, 0);
}

// Function to update theme config (would be used in admin settings)
export const updateThemeConfig = (newConfig: Partial<ThemeConfigType>) => {
  // Atualiza a configuração do tema
  Object.assign(ThemeConfig, newConfig);
  
  // Salva no localStorage para persistência
  localStorage.setItem('themeConfig', JSON.stringify(ThemeConfig));
  
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
      // Converte logo para favicon (tratando a Promise corretamente)
      createFaviconFromLogo(newConfig.logo)
        .then(faviconUrl => {
          (faviconLink as HTMLLinkElement).href = faviconUrl;
        })
        .catch(error => {
          console.error("Erro ao converter logo para favicon:", error);
        });
    }
  }
  
  // Atualiza o título da página
  if (newConfig.companyName) {
    document.title = newConfig.companyName;
  }
};

// Função para converter logo em favicon (retornando Promise<string>)
export const createFaviconFromLogo = (logoUrl: string): Promise<string> => {
  return new Promise<string>((resolve, reject) => {
    // Cria um canvas para redimensionar a imagem
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    if (!ctx) {
      reject("Não foi possível obter o contexto 2D do canvas");
      return;
    }
    
    canvas.width = 48;
    canvas.height = 48;

    const img = new Image();
    img.crossOrigin = 'Anonymous';
    
    img.onload = () => {
      // Redimensiona e centraliza a imagem
      ctx.drawImage(
        img, 
        0, 0, img.width, img.height, // source rectangle
        0, 0, 48, 48 // destination rectangle
      );
      resolve(canvas.toDataURL('image/png'));
    };
    
    img.onerror = () => {
      reject("Erro ao carregar a imagem do logo");
    };
    
    img.src = logoUrl;
  });
};
