import { ThemeConfigType } from "@/types/theme";

// Definimos a função para obter a configuração padrão do tema
export const getDefaultConfig = (): ThemeConfigType => {
  return {
    companyName: "Blue CRM",
    logo: "/logo.png",
    favicon: "/logo.png",
    
    // Azul escuro forte para menu/topo
    primaryColor: "#001440",
    primaryColorHover: "#00215e",
    primaryForeground: "#ffffff",
    // Cor de destaque para botões e itens ativos
    accentColor: "#ddcdc0",
    accentForeground: "#001440",
    // Fundo escuro para login e áreas principais
    loginBackground: "#0a1124",
    // Tipografia e bordas
    fontFamily: 'Inter, sans-serif',
    borderRadius: '0.75rem',
    tagline: "Gerencie seus negócios com eficiência",
    description: "Plataforma completa de gestão para aumentar sua produtividade e acelerar resultados.",
    philosophicalQuote: "O conhecimento é o único bem que se multiplica quando compartilhado. — Francis Bacon",
  };
};

// Exportamos diretamente o tema padrão para compatibilidade
export const defaultTheme = getDefaultConfig();
