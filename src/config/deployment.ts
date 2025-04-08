
/**
 * Configurações de implantação do sistema
 * Esse arquivo centraliza as configurações relacionadas ao deployment
 */

// Define o caminho base para a aplicação
// Como estamos usando um subdomínio, manteremos o BASE_PATH como '/'
export const BASE_PATH = '/';

// URL completa do servidor, útil para APIs absolutas
export const SERVER_URL = window.location.origin + BASE_PATH;

// Função para construir URLs com o path base correto
export const buildPath = (path: string): string => {
  // Remover barras duplicadas no início do caminho
  const cleanPath = path.startsWith('/') ? path.substring(1) : path;
  return `${BASE_PATH}${BASE_PATH.endsWith('/') ? '' : '/'}${cleanPath}`;
};
