
import { ThemeConfigType } from "@/types/theme";
import { getDefaultConfig } from "./defaultTheme";
import { createFaviconFromLogo } from "@/utils/imageUtils";
import { saveThemeToStorage, loadFromLocalStorage } from "@/utils/themeStorage";
import { supabaseClient, isSupabaseConfigured } from "@/lib/supabase";

// Inicializa com configuração padrão
export const ThemeConfig: ThemeConfigType = getDefaultConfig();

// Upload de imagem para o Supabase Storage ou localStorage como fallback
export const uploadImageToSupabase = async (imageDataUrl: string, path: string): Promise<string | null> => {
  try {
    if (isSupabaseConfigured) {
      const res = await fetch(imageDataUrl);
      const blob = await res.blob();
      const fileName = `${path}_${Date.now()}`;
      
      const { data, error } = await supabaseClient
        .storage
        .from('theme_assets')
        .upload(fileName, blob, {
          contentType: blob.type,
          upsert: true
        });
        
      if (error) {
        console.error('Erro ao fazer upload da imagem:', error);
        return imageDataUrl;
      }
      
      const { data: urlData } = supabaseClient
        .storage
        .from('theme_assets')
        .getPublicUrl(data.path);
        
      return urlData.publicUrl;
    }
    return imageDataUrl;
  } catch (error) {
    console.error('Erro ao processar o upload da imagem:', error);
    return imageDataUrl;
  }
};

// Carrega as configurações do Supabase ou localStorage como fallback
const loadSavedThemeConfig = async (): Promise<ThemeConfigType> => {
  try {
    if (isSupabaseConfigured) {
      const { data, error } = await supabaseClient
        .from('theme_config')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      if (error) {
        console.warn('Erro ao carregar configurações do Supabase:', error);
        const localConfig = loadFromLocalStorage();
        return localConfig || getDefaultConfig();
      }

      if (data) {
        return data.config as ThemeConfigType;
      }
    }
    
    const localConfig = loadFromLocalStorage();
    return localConfig || getDefaultConfig();
  } catch (error) {
    console.error('Erro ao carregar configurações do tema:', error);
    return getDefaultConfig();
  }
};

// Aplica as configurações do tema às variáveis CSS
const applyThemeToDOM = () => {
  // Adiciona todas as cores ao root para garantir consistência em todo o sistema
  if (ThemeConfig.primaryColor) {
    document.documentElement.style.setProperty('--theme-primary', ThemeConfig.primaryColor);
    document.documentElement.style.setProperty('--primary', ThemeConfig.primaryColor);
  }
  
  if (ThemeConfig.primaryColorHover) {
    document.documentElement.style.setProperty('--theme-primary-hover', ThemeConfig.primaryColorHover);
  }
  
  if (ThemeConfig.primaryForeground) {
    document.documentElement.style.setProperty('--theme-primary-foreground', ThemeConfig.primaryForeground);
    document.documentElement.style.setProperty('--primary-foreground', ThemeConfig.primaryForeground);
  }
  
  if (ThemeConfig.accentColor) {
    document.documentElement.style.setProperty('--theme-accent', ThemeConfig.accentColor);
    document.documentElement.style.setProperty('--accent', ThemeConfig.accentColor);
  }
  
  if (ThemeConfig.accentForeground) {
    document.documentElement.style.setProperty('--theme-accent-foreground', ThemeConfig.accentForeground);
    document.documentElement.style.setProperty('--accent-foreground', ThemeConfig.accentForeground);
  }
  
  // Configura o favicon e título da página
  if (ThemeConfig.favicon) {
    const faviconLink = document.querySelector("link[rel~='icon']") as HTMLLinkElement;
    if (faviconLink) {
      faviconLink.href = ThemeConfig.favicon;
      faviconLink.type = ThemeConfig.favicon.endsWith('.svg') ? 'image/svg+xml' : 'image/png';
    }
  } else if (ThemeConfig.logo) {
    // Usa o logo como favicon se o favicon não estiver definido
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
    
    // Atualiza também as meta tags
    const ogTitle = document.querySelector("meta[property='og:title']");
    if (ogTitle) {
      ogTitle.setAttribute("content", ThemeConfig.companyName);
    }
    
    const twitterTitle = document.querySelector("meta[property='twitter:title']");
    if (twitterTitle) {
      twitterTitle.setAttribute("content", ThemeConfig.companyName);
    }
  }
  
  // Atualiza descrição nas meta tags se disponível
  if (ThemeConfig.description) {
    const metaDesc = document.querySelector("meta[name='description']");
    if (metaDesc) {
      metaDesc.setAttribute("content", ThemeConfig.description);
    }
    
    const ogDesc = document.querySelector("meta[property='og:description']");
    if (ogDesc) {
      ogDesc.setAttribute("content", ThemeConfig.description);
    }
  }
  
  // Atualiza imagens nas meta tags
  if (ThemeConfig.logo) {
    const ogImage = document.querySelector("meta[property='og:image']");
    if (ogImage) {
      ogImage.setAttribute("content", ThemeConfig.logo);
    }
    
    const twitterImage = document.querySelector("meta[name='twitter:image']");
    if (twitterImage) {
      twitterImage.setAttribute("content", ThemeConfig.logo);
    }
  }
};

// Atualiza as configurações do tema
export const updateThemeConfig = async (newConfig: Partial<ThemeConfigType>): Promise<boolean> => {
  try {
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
    
    // Configura o favicon automaticamente a partir do logo se não for especificado
    if (newConfig.logo && !newConfig.favicon) {
      newConfig.favicon = newConfig.logo;
    }
    
    const updatedConfig = { ...ThemeConfig, ...newConfig };
    Object.assign(ThemeConfig, newConfig);
    
    const success = await saveThemeToStorage(updatedConfig);
    if (success) {
      applyThemeToDOM();
    }
    
    return success;
  } catch (error) {
    console.error('Erro ao atualizar configurações:', error);
    return false;
  }
};

// Inicializa o tema
if (typeof window !== 'undefined') {
  loadSavedThemeConfig().then(config => {
    Object.assign(ThemeConfig, config);
    setTimeout(applyThemeToDOM, 0);
  }).catch(error => {
    console.error('Erro ao inicializar o tema:', error);
    setTimeout(applyThemeToDOM, 0);
  });
}
