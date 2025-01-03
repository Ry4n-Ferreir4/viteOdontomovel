export interface Activity {
  id: string;
  title: string;
  date: string;
  start_time: string; // Remova o `undefined` daqui
  end_time: string; // Remova o `undefined` daqui
  user_id?: string; // Se necessário, mantenha o `?` aqui
}
