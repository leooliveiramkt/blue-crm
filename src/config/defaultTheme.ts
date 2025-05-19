
import { ThemeConfigType } from "@/types/theme";

// Definimos a função para obter a configuração padrão do tema
export const getDefaultConfig = (): ThemeConfigType => {
  return {
    companyName: "Blue CRM",
    logo: "/lovable-uploads/d26651de-acd9-4751-833d-885496a264ea.png",
    favicon: "/lovable-uploads/d26651de-acd9-4751-833d-885496a264ea.png",
    
    primaryColor: "#001440",
    primaryColorHover: "#00215e",
    primaryForeground: "#ffffff",
    accentColor: "#ddcdc0",
    
    tagline: "Gerencie seus negócios com eficiência",
    description: "Plataforma completa de gestão para aumentar sua produtividade e acelerar resultados.",
    philosophicalQuote: "O conhecimento é o único bem que se multiplica quando compartilhado. — Francis Bacon",
    
    loginBackground: undefined,
  };
};

// Exportamos diretamente o tema padrão para compatibilidade
export const defaultTheme = getDefaultConfig();
