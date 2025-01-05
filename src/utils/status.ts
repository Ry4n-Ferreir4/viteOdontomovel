import { ActivityStatus } from '../types/activity';

export const getStatusColor = (status: ActivityStatus): string => {
  const colors = {
    reservado: 'bg-yellow-100',
    confirmado: 'bg-green-100',
    atendimento_realizado: 'bg-blue-100',
    aguardando_atendimento: 'bg-green-50',
    cancelado: 'bg-red-100'
  };
  return colors[status];
};

export const getStatusLabel = (status: ActivityStatus): string => {
  const labels = {
    reservado: 'Reservado',
    confirmado: 'Confirmado',
    atendimento_realizado: 'Atendimento Realizado',
    aguardando_atendimento: 'Aguardando Atendimento',
    cancelado: 'Cancelado'
  };
  return labels[status];
};