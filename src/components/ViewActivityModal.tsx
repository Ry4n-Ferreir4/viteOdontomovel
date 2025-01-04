import React from 'react';
import { Activity } from '../types/activity';
import { supabase } from '../lib/supabase';

interface ViewActivityModalProps {
  activity: Activity;
  onClose: () => void;
}

export const ViewActivityModal: React.FC<ViewActivityModalProps> = ({ activity, onClose }) => {
  const [currentUser, setCurrentUser] = React.useState<string | null>(null);

  React.useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      setCurrentUser(user?.id || null);
    });
  }, []);

  const isOwner = currentUser === activity.user_id;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Detalhes da Atividade</h2>
          <div className="flex items-center space-x-2">
            <span className={`px-2 py-1 rounded text-sm ${
              activity.visibility === 'public' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
            }`}>
              {activity.visibility === 'public' ? 'Pública' : 'Privada'}
            </span>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
              ✕
            </button>
          </div>
        </div>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Título</label>
            <p className="mt-1 p-2 bg-gray-50 rounded">{activity.title}</p>
          </div>
          
          {activity.description && (
            <div>
              <label className="block text-sm font-medium text-gray-700">Descrição</label>
              <p className="mt-1 p-2 bg-gray-50 rounded whitespace-pre-wrap">
                {activity.description}
              </p>
            </div>
          )}
          
          <div>
            <label className="block text-sm font-medium text-gray-700">Data</label>
            <p className="mt-1 p-2 bg-gray-50 rounded">
              {new Date(activity.date).toLocaleDateString('pt-BR')}
            </p>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700">Horário</label>
            <p className="mt-1 p-2 bg-gray-50 rounded">
              {activity.start_time} - {activity.end_time}
            </p>
          </div>

          {!isOwner && activity.visibility === 'public' && (
            <p className="text-sm text-gray-500 italic">
              Esta é uma atividade pública criada por outro usuário
            </p>
          )}
        </div>
        
        <button
          onClick={onClose}
          className="mt-6 w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
        >
          Fechar
        </button>
      </div>
    </div>
  );
};
