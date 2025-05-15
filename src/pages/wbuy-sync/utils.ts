
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

/**
 * Formata data para exibição no formato brasileiro
 */
export const formatDate = (dateString: string) => {
  if (!dateString) return '-';
  return format(new Date(dateString), 'dd/MM/yyyy HH:mm:ss', { locale: ptBR });
};

/**
 * Formata valor para moeda brasileira
 */
export const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(value);
};
