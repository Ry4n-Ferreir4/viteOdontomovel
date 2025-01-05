export type ActivityStatus = 
  | 'reservado'
  | 'confirmado'
  | 'atendimento_realizado'
  | 'aguardando_atendimento'
  | 'cancelado';

export interface Activity {
  id: string;
  title: string;
  date: string;
  start_time: string;
  end_time: string;
  description?: string;
  visibility: 'public' | 'private';
  status: ActivityStatus;
  user_id?: string;
}