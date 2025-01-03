export interface Activity {
  id: string;
  title: string;
  date: string;
  start_time: string;
  end_time: string;
  description?: string;
  visibility: 'public' | 'private';
  user_id?: string;
}