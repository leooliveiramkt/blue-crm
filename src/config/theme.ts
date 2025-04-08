// Theme configuration for white-labeling the app
import { supabaseClient, isSupabaseConfigured } from "@/lib/supabase";

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

// Carrega as configurações do Supabase ou localStorage como fallback
const loadSavedThemeConfig = async (): Promise<ThemeConfigType> => {
  try {
    // Verifica se o Supabase está configurado
    if (isSupabaseConfigured) {
      // Tenta buscar do Supabase primeiro
      const { data, error } = await supabaseClient
        .from('theme_config')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      if (error) {
        console.warn('Erro ao carregar configurações do Supabase:', error);
        // Fallback para localStorage se o Supabase falhar
        return loadFromLocalStorage();
      }

      if (data) {
        return data.config as ThemeConfigType;
      }
    } else {
      console.warn('Supabase não configurado, usando localStorage para configurações de tema');
      return loadFromLocalStorage();
    }
  } catch (error) {
    console.error('Erro ao carregar configurações do tema:', error);
    // Fallback para localStorage
    return loadFromLocalStorage();
  }
  
  // Se não conseguir do Supabase, tenta do localStorage
  return loadFromLocalStorage();
};

// Função de carregamento do localStorage (fallback)
const loadFromLocalStorage = (): ThemeConfigType => {
  const savedConfig = localStorage.getItem('themeConfig');
  if (savedConfig) {
    try {
      return JSON.parse(savedConfig);
    } catch (error) {
      console.error('Erro ao carregar configurações do localStorage:', error);
    }
  }
  
  // Retorna as configurações padrão se não houver configurações salvas
  return getDefaultConfig();
};

// Configurações padrão
const getDefaultConfig = (): ThemeConfigType => {
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

// Inicializa com um estado padrão, depois será atualizado assincronamente
export const ThemeConfig: ThemeConfigType = getDefaultConfig();

// Upload de imagem para o Supabase Storage ou localStorage como fallback
export const uploadImageToSupabase = async (imageDataUrl: string, path: string): Promise<string | null> => {
  try {
    // Verifica se o Supabase está configurado
    if (isSupabaseConfigured) {
      // Converte base64 para blob
      const res = await fetch(imageDataUrl);
      const blob = await res.blob();
      
      // Nome do arquivo único
      const fileName = `${path}_${Date.now()}`;
      
      // Upload para o Supabase
      const { data, error } = await supabaseClient
        .storage
        .from('theme_assets')
        .upload(fileName, blob, {
          contentType: blob.type,
          upsert: true
        });
        
      if (error) {
        console.error('Erro ao fazer upload da imagem:', error);
        // Fallback: salva como Data URL no localStorage
        return imageDataUrl;
      }
      
      // Retorna a URL pública da imagem
      const { data: urlData } = supabaseClient
        .storage
        .from('theme_assets')
        .getPublicUrl(data.path);
        
      return urlData.publicUrl;
    } else {
      console.warn('Supabase não configurado, salvando imagem como Data URL');
      // Fallback: retorna a própria Data URL quando o Supabase não está disponível
      return imageDataUrl;
    }
  } catch (error) {
    console.error('Erro ao processar o upload da imagem:', error);
    // Fallback: retorna a própria Data URL em caso de erro
    return imageDataUrl;
  }
};

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

// Carrega as configurações iniciais de forma assíncrona
if (typeof window !== 'undefined') {
  // Executa apenas no cliente, não durante SSR
  loadSavedThemeConfig().then(config => {
    // Atualiza o objeto ThemeConfig com os valores carregados
    Object.assign(ThemeConfig, config);
    // Aplica as configurações ao DOM
    setTimeout(applyThemeToDOM, 0);
  }).catch(error => {
    console.error('Erro ao inicializar o tema:', error);
    // Ainda assim, tenta aplicar as configurações padrão
    setTimeout(applyThemeToDOM, 0);
  });
}

// Function to update theme config (would be used in admin settings)
export const updateThemeConfig = async (newConfig: Partial<ThemeConfigType>): Promise<boolean> => {
  try {
    // Processa as imagens que são data URLs para upload no Supabase
    if (newConfig.logo && newConfig.logo.startsWith('data:')) {
      const logoUrl = await uploadImageToSupabase(newConfig.logo, 'logo');
      if (logoUrl) {
        newConfig.logo = logoUrl;
      }
    }
    
    if (newConfig.loginBackground && newConfig.loginBackground.startsWith('data:')) {
      const bgUrl = await uploadImageToSupabase(newConfig.loginBackground, 'background');
      if (bgUrl) {
        newConfig.loginBackground = bgUrl;
      }
    }
    
    // Atualiza a configuração do tema localmente
    const updatedConfig = { ...ThemeConfig, ...newConfig };
    Object.assign(ThemeConfig, newConfig);
    
    // Salva no Supabase se estiver configurado
    if (isSupabaseConfigured) {
      const { error } = await supabaseClient
        .from('theme_config')
        .insert({
          config: updatedConfig,
          created_at: new Date().toISOString()
        });
        
      if (error) {
        console.error('Erro ao salvar configurações no Supabase:', error);
        // Fallback para localStorage
        localStorage.setItem('themeConfig', JSON.stringify(updatedConfig));
      }
    } else {
      // Salva diretamente no localStorage se o Supabase não estiver disponível
      console.warn('Supabase não configurado, salvando configurações no localStorage');
      localStorage.setItem('themeConfig', JSON.stringify(updatedConfig));
    }
    
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
    
    return true;
  } catch (error) {
    console.error('Erro ao atualizar configurações:', error);
    return false;
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
