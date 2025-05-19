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
  loginBackground?: string;
  tagline?: string;
  description?: string;
  philosophicalQuote?: string;
  
  // Other UI customizations
  fontFamily?: string;
  borderRadius?: string;
}
