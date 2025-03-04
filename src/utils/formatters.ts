
import { format, isValid } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(amount);
};

export const parseCurrency = (value: string): number => {
  // Replace comma with dot for decimal
  const parsedValue = value.replace(',', '.');
  const numericValue = parseFloat(parsedValue);
  return isNaN(numericValue) ? 0 : numericValue;
};

export const formatPercentage = (value: number): string => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'percent',
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  }).format(value / 100);
};

export const getCurrentMonthYear = (): string => {
  const date = new Date();
  return format(date, 'MMMM yyyy', { locale: ptBR });
};

export const formatDate = (date: Date): string => {
  if (!isValid(date)) return 'Data inválida';
  return format(date, 'dd/MM/yyyy');
};

export const formatMonthYear = (date: Date): string => {
  if (!isValid(date)) return 'Data inválida';
  // Capitalize first letter
  const formatted = format(date, 'MMMM yyyy', { locale: ptBR });
  return formatted.charAt(0).toUpperCase() + formatted.slice(1);
};

export const formatDayMonth = (date: Date): string => {
  if (!isValid(date)) return 'Data inválida';
  return format(date, 'dd MMM', { locale: ptBR });
};

export const formatTimeAgo = (date: Date): string => {
  const now = new Date();
  const diffInDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
  
  if (diffInDays === 0) return 'Hoje';
  if (diffInDays === 1) return 'Ontem';
  if (diffInDays < 7) return `${diffInDays} dias atrás`;
  if (diffInDays < 30) return `${Math.floor(diffInDays / 7)} semanas atrás`;
  if (diffInDays < 365) return `${Math.floor(diffInDays / 30)} meses atrás`;
  return `${Math.floor(diffInDays / 365)} anos atrás`;
};
