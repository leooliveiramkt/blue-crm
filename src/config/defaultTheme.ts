
import { ThemeConfigType } from "@/types/theme";

export const getDefaultConfig = (): ThemeConfigType => {
  return {
    companyName: "Blue CRM",
    logo: "/logo.svg",
    favicon: "/favicon.svg",
    
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
