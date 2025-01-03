import { startOfMonth, endOfMonth, eachDayOfInterval, format, getDay } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export const getMonthDays = (year: number, month: number) => {
  const firstDay = new Date(year, month - 1, 1);
  const lastDay = endOfMonth(firstDay);
  
  return eachDayOfInterval({ start: firstDay, end: lastDay });
};

export const getMonthName = (month: number) => {
  const date = new Date(2025, month - 1, 1);
  return format(date, 'MMMM', { locale: ptBR });
};

export const getWeekDays = () => {
  const weekDays = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
  return weekDays;
};