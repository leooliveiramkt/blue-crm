
/**
 * Capitaliza a primeira letra de uma string
 */
export const capitalizeFirstLetter = (string: string): string => {
  return string.charAt(0).toUpperCase() + string.slice(1);
};
